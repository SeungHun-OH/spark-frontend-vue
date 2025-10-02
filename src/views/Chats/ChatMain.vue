<template>
  <div>
    <div class="banner">
      <div class="banner-left">
        <div>
          <h2>My Feed</h2>
          <small class="text-muted">Manage your posts and profile</small>
        </div>
      </div>
    </div>
    <h4>Chats</h4>
    <ul class="list-group">
      <li v-for="(chat, i) in chats" :key="i" class="list-group-item d-flex justify-content-between align-items-center">
        <router-link :to="`/chat/chatting/${chat.encodedUUID}`">
          <div>
            <strong>{{ chat.chatRoomName }}</strong><br />
            <!-- <small>{{ chat.lastMessage }}</small> -->
          </div>
          <!-- <span class="badge bg-primary rounded-pill">{{ chat.unread }}</span> -->
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import chatApi from '@/apis/chatApi';
import { ref, onMounted } from 'vue';
import { Client, Stomp } from '@stomp/stompjs';



// onMounted(async() => {
//   await getChatList(); //1.프로필 먼저 불러오기
//   console.log("test");
// });



// const chats = ref([
//   { name: "Emma", lastMessage: "See you soon!", unread: 2 },
//   { name: "Jordan", lastMessage: "How was your day?", unread: 0 },
//   { name: "Sophia", lastMessage: "Let's meet tomorrow", unread: 1 }
// ]);
const chats = ref();
console.log(chats);

let stompClient = null;
const jwtToken = "Bearer eyJhbGciOiJIUzUxMiJ9.eyJtZW1iZXJObyI6MSwiaWF0IjoxNzU5MjE4NzgzLCJleHAiOjE3NTk1Nzg3ODN9.vcr-ZbZf0ChGAvgcbueIcF-e6Ekb_msDxAUxs9RhjwMIPMBTcZyFmhk6DxmdfI8tsoHvbYfyCgbvp5PuDS410g"

function connect() {
  stompClient = new Client({
    webSocketFactory: function () {
      return new WebSocket("ws://localhost:8040/ws-stomp")
    },
    connectHeaders: {
      Authorization: jwtToken
    },
    debug: function (str) {
      console.log(str);
    },
    reconnectDelay: 5000
  });
  stompClient.onConnect = function (frame) {
    console.log("연결");
  }

  stompClient.activate();
}






async function getChatList() {
  const response = await chatApi.getChatList();
  console.log(response.data.data)
  chats.value = response.data.data;
}

onMounted(

  async () => {
    await getChatList();
  }),
  connect();

</script>
