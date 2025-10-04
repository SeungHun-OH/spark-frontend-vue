<template>
  <div class="container py-4 position-relative">
    <div :class="{ 'blurred': isLoading }">
      <!-- 헤더 -->
      <div class="d-flex align-items-center mb-3 p-3 bg-light rounded shadow-sm">
        <button class="btn btn-link text-dark me-3 p-0" @click="goToChatList">
          <i class="bi bi-arrow-left fs-4"></i>
        </button>
        <img :src="partner.profileImg" alt="profile"
             class="rounded-circle me-3" style="width: 50px; height: 50px;" />
        <div>
          <h5 class="mb-0">{{ partner.name }}, {{ partner.age }}</h5>
        </div>
      </div>

      <!-- 메시지 -->
      <div class="card">
        <div ref="chatContainer" class="card-body chat-box">
          <template v-for="msg in messages" :key="msg.cmNo">
            <div class="d-flex mb-3" :class="msg.cmSendUserFlag ? 'justify-content-end' : 'justify-content-start'">
              <div class="p-2 rounded"
                   :class="msg.cmSendUserFlag 
                            ? 'bg-primary text-white text-end' 
                            : 'bg-white border text-start'"
                   style="max-width: 70%;">
                <div>{{ msg.cmMessage }}</div>
                <div class="text-muted small">{{ formatTime(msg.cmDateObj) }}</div>
              </div>
            </div>
          </template>
        </div>

        <!-- 입력창 -->
        <div class="card-footer">
          <div class="input-group">
            <input v-model="input" @keyup.enter="handleSend" type="text" class="form-control"
                   placeholder="메시지를 입력하세요..." />
            <button class="btn btn-primary" @click="handleSend">보내기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import chatApi from "@/apis/chatApi";
import { onMounted, ref, onUnmounted, onUpdated, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import stompClient from "@/sockets/stompClient";

const router = useRouter();
const route = useRoute();
const input = ref("");
const messages = ref([]);
const chatContainer = ref(null);

const partner = ref({ name: "로딩중...", age: "  ", profileImg: "https://placehold.co/50x50" });
const isLoading = ref(true);

// ✅ route param 감시해서 방 이동 시 자동 구독 교체
watch(
  () => route.params.chatRoomBaseUuid,
  async (newRoomId) => {
    if (!newRoomId) return;

    // 채팅 내역 불러오기
    await getChattingMessageList(newRoomId);

    // 구독 교체
    stompClient.subscribeRoom(newRoomId, (msg) => {
      const parsed = { ...msg, cmDateObj: new Date(msg.cmDate) };
      if (!parsed.cmNo || messages.value.every(m => m.cmNo !== parsed.cmNo)) {
        messages.value.push(parsed);
      }
    });
  },
  { immediate: true }
);

onMounted(() => {
  // ✅ 이미 연결이 있으면 재사용
  stompClient.connect();
});

onUnmounted(() => {
  // ✅ 연결은 유지, 구독만 해제
  stompClient.unsubscribe();
});

function handleSend() {
  if (!input.value.trim()) return;
  const cmNo = `local-${Date.now()}-${Math.random()}`;
  const localMsg = { cmNo, cmMessage: input.value, cmDateObj: new Date(), cmSendUserFlag: true };
  messages.value.push(localMsg);
  stompClient.sendMessage(route.params.chatRoomBaseUuid, { cmMessage: input.value, cmNo });
  input.value = "";
}

function formatTime(d) {
  if (!(d instanceof Date) || isNaN(d)) return "";
  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours < 12 ? "오전" : "오후";
  const hour12 = hours % 12 || 12;
  return `${ampm} ${hour12}:${minutes}`;
}

function goToChatList() {
  router.push("/chat");
}

async function getChattingMessageList(roomId) {
  const { profile, chatMessages } = (await chatApi.getChattingMessageList(roomId)).data.data;

  partner.value = {
    ...partner.value,
    name: profile.name,
    age: profile.age,
    profileImg: profile.mpBase64Data || partner.value.profileImg
  };

  messages.value = chatMessages.map(m => ({
    ...m,
    cmDateObj: new Date(m.cmDate)
  }));

  isLoading.value = false;
}

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
}
onUpdated(scrollToBottom);
</script>

<style scoped>
.chat-box {
  background-color: #f8f9fa;
  height: 400px;
  overflow-y: auto;
}
.blurred {
  filter: blur(3px);
  pointer-events: none;
}
</style>