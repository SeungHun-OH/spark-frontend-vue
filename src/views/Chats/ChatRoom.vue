<template>
  <div class="container py-4">
    <!-- 채팅방 헤더 -->
    <div class="d-flex align-items-center mb-3 p-3 bg-light rounded shadow-sm">
      <!-- 좌측: 심플한 뒤로가기 버튼 -->
      <button class="btn btn-link text-dark me-3 p-0" @click="goToChatList">
        <i class="bi bi-arrow-left fs-4"></i>
      </button>

      <!-- 상대방 프로필 -->
      <img
        :src="partner.profileImg"
        alt="profile"
        class="rounded-circle me-3"
        style="width: 50px; height: 50px;"
      />
      <div>
        <h5 class="mb-0">{{ partner.name }}, {{ partner.age }}</h5>
        <small class="text-muted">{{ partner.status }}</small>
      </div>
    </div>

    <!-- 채팅 카드 -->
    <div class="card">
      <div class="card-body chat-box" style="height: 400px; overflow-y: auto;">
        <!-- 메시지 반복 -->
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          class="d-flex mb-3"
          :class="msg.isMine ? 'justify-content-end' : 'justify-content-start'"
        >
          <div
            class="p-2 rounded"
            :class="msg.isMine ? 'bg-primary text-white' : 'bg-white border'"
            style="max-width: 70%;"
          >
            <div>{{ msg.text }}</div>
            <div class="text-muted small text-end">{{ msg.time }}</div>
          </div>
        </div>
      </div>

      <!-- 입력창 -->
      <div class="card-footer">
        <div class="input-group">
          <input
            v-model="input"
            @keyup.enter="sendMessage"
            type="text"
            class="form-control"
            placeholder="메시지를 입력하세요..."
          />
          <button class="btn btn-primary" @click="sendMessage">보내기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import chatApi from "@/apis/chatApi";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const input = ref("");
const messages = ref();
const params = route.params.chatRoomBaseUuid;

// 상대방 프로필 정보
const partner = ref({
  name: "Emma Wilson",
  age: 26,
  status: "온라인",
  profileImg: "https://via.placeholder.com/50"
});

// 메시지 목록
// const messages = ref([
//   { text: "Hi! Thanks for matching with me 😊", time: "10:30 AM", isMine: false },
//   { text: "Hi! Nice to meet you! I loved your hiking photos", time: "10:32 AM", isMine: true },
//   { text: "Thank you! I see you're into photography too. Do you have any favorite spots?", time: "10:35 AM", isMine: false }
// ]);



function sendMessage() {
  if (!input.value.trim()) return;
  messages.value.push({
    text: input.value,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    isMine: true
  });
  input.value = "";
}

// 채팅방 리스트로 이동
function goToChatList() {
  router.push("/chat");
}

async function getChattingMessageList() {
  const response = await chatApi.getChattingMessageList(params);
  messages.value = response.data.data;
console.log(messages.value);
}

onMounted(

  async () => {
    getChattingMessageList();
  })
</script>

<style scoped>
.chat-box {
  background-color: #f8f9fa;
}
</style>