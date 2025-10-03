// sockets/stompClient.js
import { Client } from "@stomp/stompjs";

let client = null;
let subscription = null;
const jwtToken = "eyJhbGciOiJIUzUxMiJ9.eyJtZW1iZXJObyI6MSwiaWF0IjoxNzU5MjE4NzgzLCJleHAiOjE3NTk1Nzg3ODN9.vcr-ZbZf0ChGAvgcbueIcF-e6Ekb_msDxAUxs9RhjwMIPMBTcZyFmhk6DxmdfI8tsoHvbYfyCgbvp5PuDS410g"

// ✅ 연결 (이미 연결되어 있으면 재사용)
function connect(onConnected) {
  if (client && client.connected) {
    console.log("STOMP already connected, reuse existing connection");
    if (onConnected) onConnected();
    return;
  }

  client = new Client({
    brokerURL: "ws://localhost:8040/ws-stomp",
    reconnectDelay: 5000,
    connectHeaders: {
      Authorization: `Bearer ${jwtToken}`
    },
    onConnect: () => {
      console.log("Connected to STOMP");
      if (onConnected) onConnected();
    },
    onStompError: (frame) => {
      console.error("Broker error", frame);
    }
  });

  client.activate();
}

// ✅ 특정 채팅방 구독 (/sub/room/{roomId})
function subscribeRoom(roomId, onMessage) {
  if (!client || !client.connected) return;

  if (subscription) {
    subscription.unsubscribe();
    subscription = null;
  }

  if (!roomId) return;

  subscription = client.subscribe(`/sub/room/${roomId}`, (msg) => {
    if (onMessage) {
      onMessage(JSON.parse(msg.body));
    }
  });

  console.log(`Subscribed to room ${roomId}`);
}

// ✅ 채팅 리스트 구독 (/sub/room)
function subscribeRoomList(onMessage) {
  if (!client || !client.connected) return;

  if (subscription) {
    subscription.unsubscribe();
    subscription = null;
  }

  subscription = client.subscribe(`/sub/room`, (msg) => {
    if (onMessage) {
      onMessage(JSON.parse(msg.body));
    }
  });

  console.log("Subscribed to room list (/sub/room)");
}

// ✅ 메시지 전송 (/pub/room/{roomId})
function sendMessage(roomId, body) {
  if (client && client.connected) {
    client.publish({
      destination: `/pub/room/${roomId}`,
      body: JSON.stringify(body)
    });
  }
}

// ✅ 현재 구독만 해제
function unsubscribe() {
  if (subscription) {
    subscription.unsubscribe();
    subscription = null;
    console.log("Unsubscribed from current subscription");
  }
}

// ✅ 연결 완전히 종료
function disconnect() {
  unsubscribe();
  if (client) {
    client.deactivate();
    client = null;
    console.log("Disconnected from STOMP");
  }
}

export default {
  connect,
  subscribeRoom,
  subscribeRoomList,
  sendMessage,
  unsubscribe,
  disconnect
};