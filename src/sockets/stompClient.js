// sockets/stompClient.js
import { Client } from "@stomp/stompjs";

let client = null;
let subscriptions = {};
let isConnecting = false; // 연결 시도 중 여부
let statusSubscribed = false; // /sub/status 중복 구독 방지


const jwtToken = "eyJhbGciOiJIUzUxMiJ9.eyJtZW1iZXJObyI6MSwiaWF0IjoxNzU5NTc5MTAyLCJleHAiOjE3NjA2NTkxMDJ9.bXe7xLBaMxPaucazjBAtSLCZqxdKDaDvGfxfm07z2AcLeRez8o8BwF_X7hNEqyDi7kY7D6JuYXYtcx8WI2w_Ng";

function isConnected() {
  return !!client && client.connected === true;
}

function connect(onConnected) {
  if (client && client.connected) {
    console.log("STOMP already connected, reuse existing connection");
    if (onConnected) onConnected();
    return;
  }
  if (isConnecting) {
    console.log("STOMP connection already in progress");
    return;
  }

  isConnecting = true;

  client = new Client({
    brokerURL: "ws://localhost:8040/ws-stomp",
    reconnectDelay: 5000,
    connectHeaders: {
      Authorization: `Bearer ${jwtToken}`, // ← 백틱 문자열로 수정
    },
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    onConnect: () => {
      console.log("Connected to STOMP");
      isConnecting = false;

      // 전역 상태 구독은 필요 시 한 번만
      if (!statusSubscribed) {
        subscribe("/sub/status", (payload) => {
          // 전역 브로드캐스트 (뷰 컴포넌트에서 듣도록)
          document.dispatchEvent(
            new CustomEvent("status-event", { detail: payload })
          );
        });
        statusSubscribed = true;
      }

      if (onConnected) onConnected();
    },
    onStompError: (frame) => {
      const msg = frame.headers["message"] || "STOMP ERROR";
      const details = frame.body || "";
      console.error("STOMP ERROR:", msg, details);

      const dest = frame.headers["destination"];
      if (dest && subscriptions[dest]) {
        subscriptions[dest].unsubscribe();
        delete subscriptions[dest];
        console.log(`자동 구독 해제: ${dest}`);
      }
    },
    onWebSocketClose: () => {
      // 연결 종료 시 상태 초기화
      isConnecting = false;
      statusSubscribed = false;
    },
  });

  client.activate();
}

function subscribe(destination, onMessage) {
  if (!client || !client.connected) {
    console.warn("STOMP not connected. Skip subscribe:", destination);
    return;
  }
  // 중복 구독 제거
  if (subscriptions[destination]) {
    subscriptions[destination].unsubscribe();
    delete subscriptions[destination];
  }

  const sub = client.subscribe(destination, (msg) => {
    let payload = msg.body;
    if (typeof msg.body === "string") {
      try {
        payload = JSON.parse(msg.body);
      } catch {
        // 문자열 그대로 전달
      }
    }
    if (onMessage) onMessage(payload);
  });

  subscriptions[destination] = sub;
  console.log(`Subscribed to ${destination}`);
}

function subscribeRoom(roomId, onMessage) {
  if (!roomId) {
    console.warn("roomId가 없습니다. 기본 채널로 구독을 고려하세요.");
    return;
  }
  subscribe(`/sub/room/${roomId}`, onMessage);
}

function subscribeRoomList(onMessage) {
  subscribe("/sub/room", onMessage);
}

function subscribeStatus(onMessage) {
  subscribe("/sub/status", onMessage);
  statusSubscribed = true;
}

function sendMessage(roomId, body) {
  if (client && client.connected) {
    client.publish({
      destination: `/pub/room/${roomId}`,
      body: JSON.stringify(body),
    });
  } else {
    console.warn("STOMP not connected. Message not sent.");
  }
}

function unsubscribeRoom(roomId) {
  const destination = `/sub/room/${roomId}`;
  unsubscribe(destination);
}

function unsubscribe(destination) {
  if (subscriptions[destination]) {
    subscriptions[destination].unsubscribe();
    delete subscriptions[destination];
    console.log(`Unsubscribed from ${destination}`);
  }
}

function unsubscribeAll() {
  Object.keys(subscriptions).forEach((dest) => {
    subscriptions[dest].unsubscribe();
    console.log(`Unsubscribed from ${dest}`);
  });
  subscriptions = {};
  statusSubscribed = false;
}

function listSubscriptions() {
  const list = Object.keys(subscriptions);
  console.log("현재 구독 중인 destination 목록:", list);
  return list;
}

function disconnect() {
  unsubscribeAll();
  if (client) {
    client.deactivate();
    client = null;
    isConnecting = false;
    console.log("Disconnected from STOMP");
  }
}

export default {
  isConnected,
  connect,
  subscribe,
  subscribeRoom,
  subscribeRoomList,
  subscribeStatus,
  sendMessage,
  unsubscribeRoom,
  unsubscribe,
  unsubscribeAll,
  listSubscriptions,
  disconnect,
};