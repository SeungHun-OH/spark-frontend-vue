<template>
  <div class="container py-4 position-relative">
    <div :class="{ 'blurred': isLoading }">
      <!-- 헤더 -->
      <div class="d-flex align-items-center mb-3 p-3 bg-light rounded shadow-sm">
        <button class="btn btn-link text-dark me-3 p-0" @click="goToChatList">
          <i class="bi bi-arrow-left fs-4"></i>
        </button>
        <!-- 프로필 + 상태 -->
        <div class="position-relative me-3" style="width: 50px; height: 50px;">
          <img :src="partner.profileImg" alt="profile" class="rounded-circle" style="width: 50px; height: 50px;" />
          <!-- 상태 표시 -->
          <span class="status-indicator" :class="partner.status === 'ONLINE' ? 'online' : 'offline'"></span>
        </div>
        <div>
          <h5 class="mb-0">{{ partner.name }}, {{ partner.age }}</h5>
        </div>
      </div>

      <!-- 메시지 -->
      <div class="card">
        <div ref="chatContainer" class="card-body chat-box">
          <template v-for="(msg, index) in messages" :key="msg.cmNo">
            <!-- ✅ 날짜 구분 박스 -->
            <div v-if="index === 0 || !isSameDay(messages[index - 1].cmDateObj, msg.cmDateObj)"
                 class="text-center my-2">
              <span class="badge bg-secondary">
                {{ formatDate(msg.cmDateObj) }}
              </span>
            </div>

            <!-- 메시지 -->
            <div class="d-flex mb-3" :class="msg.cmSendUserFlag ? 'justify-content-end' : 'justify-content-start'">
              <div class="p-2 rounded"
                :class="msg.cmSendUserFlag ? 'bg-primary text-white text-end' : 'bg-white border text-start'"
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
import { useStore } from "vuex";


const router = useRouter();
const route = useRoute();
const input = ref("");
const messages = ref([]);
const chatContainer = ref(null);
const currentRoomId = ref(null);
const store = useStore();
const myUuid = store.getters["auth/getmemberUuid"];

const partner = ref({
  name: "로딩중...",
  age: " ",
  profileImg: "https://placehold.co/50x50",
  opponentUuid: null,
  status: "OFFLINE"
});
const isLoading = ref(true);

let statusListenerAdded = false;

function handleMessage(msg) {
  const parsed = { ...msg, cmDateObj: new Date(msg.cmDate) };
  if(myUuid != parsed.cmSendMemberUuid){
    messages.value.push(parsed);
    chatApi.updateLastMessage(parsed.cmNo);
  }
  // }
}

// 라우트 감시: 구독만 교체
watch(
  () => route.params.chatRoomBaseUuid,
  async (newRoomId) => {
    if (!newRoomId) return;
    currentRoomId.value = newRoomId;

    if (stompClient.isConnected && stompClient.isConnected()) {
      stompClient.subscribeRoom(newRoomId, handleMessage);
    }
    await getChattingMessageList(newRoomId);
  },
  { immediate: true }
);

onMounted(() => {
  const roomId = route.params.chatRoomBaseUuid;

  // 마운트 시 한 번만 connect
  stompClient.connect(() => {
    if (roomId) {
      stompClient.subscribeRoom(roomId, handleMessage);
      getChattingMessageList(roomId);
    }

    // 전역 상태 이벤트 리스너는 한 번만 등록
    if (!statusListenerAdded) {
      document.addEventListener("status-event", (e) => {
        const payload = e.detail;
        if (payload.memberUuid === partner.value.opponentUuid) {
          partner.value.status = payload.memberStatus;
        }
      });
      statusListenerAdded = true;
    }
  });
});

onUnmounted(() => {
  if (currentRoomId.value) {
    stompClient.unsubscribeRoom(currentRoomId.value);
  }
  // 필요 시 전체 연결 종료
  // stompClient.disconnect();
});

function handleSend() {
  if (!input.value.trim()) return;
  const cmNo = `local-${Date.now()}-${Math.random()}`;
  const localMsg = {
    cmNo,
    cmMessage: input.value,
    cmDateObj: new Date(),
    cmSendUserFlag: true,
  };
  messages.value.push(localMsg);

  stompClient.sendMessage(route.params.chatRoomBaseUuid, {
    cmMessage: input.value,
    cmOpponentUuid: partner.value.opponentUuid,
    cmSendMemberUuid: myUuid
  });

  input.value = "";
}

async function getChattingMessageList(roomId) {
  try {
    const response = await chatApi.getChattingMessageList(roomId);
    const responseData = response.data.data;
    if (!responseData) throw new Error("채팅 데이터가 없습니다.");

    const { profile, chatMessages } = responseData;
    partner.value = {
      name: profile.name,
      age: profile.age,
      nickName: profile.nickName,
      profileImg: profile.mpBase64Data || partner.value.profileImg,
      opponentUuid: profile.opponentUuid,
      status: profile.status,
    };
    messages.value = chatMessages.map((m) => ({
      ...m,
      cmDateObj: new Date(m.cmDate),
    }));
    isLoading.value = false;
  } catch (error) {
    console.error("채팅 내역 불러오기 실패:", error);
    if (error.code === "ERR_BAD_REQUEST") router.push("/chat");
  }
}

function formatTime(d) {
  if (!(d instanceof Date) || isNaN(d)) return "";
  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours < 12 ? "오전" : "오후";
  const hour12 = hours % 12 || 12;
  return `${ampm} ${hour12}:${minutes}`;
}

function formatDate(d) {
  if (!(d instanceof Date) || isNaN(d)) return "";
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
}

function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function goToChatList() {
  router.push("/chat");
}

onUpdated(() => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
});
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

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #fff;
}
.status-indicator.online {
  background-color: #28a745;
}
.status-indicator.offline {
  background-color: #6c757d;
}
</style>