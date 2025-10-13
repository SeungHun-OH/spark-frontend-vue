<template>
  <div>
    <div class="banner">
      <div class="banner-left">
        <div>
          <h2>chatRoomList</h2>
          <small class="text-muted">Manage your posts and profile</small>
        </div>
      </div>
    </div>

    <ul class="list-group">
      <!-- 채팅방이 없을 때 메시지 -->
      <div v-if="chatRoomList.length === 0" class="text-center text-muted py-5">
        <i class="bi bi-emoji-frown fs-1 mb-3 d-block"></i>
        채팅방이 없습니다.
      </div>

      <!-- 채팅방 리스트 -->
      <router-link v-else v-for="(chatRoom, i) in chatRoomList" :key="i" :to="`/chat/chatting/${chatRoom.encodedUUID}`"
        class="list-group-item d-flex justify-content-between align-items-center chat-item">
        <!-- ✅ 좌측 -->
        <div class="d-flex align-items-center">
          <div class="position-relative me-3" style="width: 50px; height: 50px;">
            <img :src="'http://localhost:8040/matching/picture/'+`${chatRoom.attachNo}` || 'https://placehold.co/50x50'" alt="profile" class="rounded-circle"
              style="width: 50px; height: 50px;" />
            <span class="status-indicator" :class="chatRoom.status === 'ONLINE' ? 'online' : 'offline'"></span>
          </div>
          <div>
            <strong>{{ chatRoom.chatRoomName }}</strong>, <small>{{ chatRoom.age }}</small><br />
            <small class="text-muted">{{ chatRoom.lastMessage }}</small>
          </div>
        </div>

        <!-- ✅ 우측 -->
        <div class="chat-right">
          <small class="text-muted">{{ formatTime(chatRoom.date) }}</small>
          <span v-if="chatRoom.unreadCount > 0" class="unread-badge">
            {{ chatRoom.unreadCount }}
          </span>
        </div>
      </router-link>
    </ul>

  </div>
</template>

<script setup>
import chatApi from "@/apis/chatApi";
import { ref, onMounted, onUnmounted, watch } from "vue";
import stompClient from "@/sockets/stompClient";
import { useRoute } from "vue-router";

const chatRoomList = ref([]);
const route = useRoute();

// ✅ 리스트 불러오기
async function getChatList() {
  const response = await chatApi.getChatList();
  chatRoomList.value = response.data.data;
}

// ✅ 서버에서 발행한 ChatRoomEvent 처리
function handleRoomEvent(event) {
  const room = chatRoomList.value.find(
    (c) => c.encodedUUID === event.chatRoomBase62RoomUUID
  );
  if (room) {
    room.lastMessage = event.lastMessage;
    room.date = event.lastMessageDate ?? room.date;
    room.unreadCount++;
  }
}

// ✅ 시간 포맷
function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";

  const today = new Date().toLocaleDateString("ko-KR");
  const msgDay = d.toLocaleDateString("ko-KR");

  if (today === msgDay) {
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours < 12 ? "오전" : "오후";
    const hour12 = hours % 12 || 12;
    return `${ampm} ${hour12}:${minutes}`;
  } else {
    return msgDay;
  }
}

onMounted(async () => {

  stompClient.connect(() => {
    stompClient.subscribeRoomList((event) => {
      handleRoomEvent(event);
    });
  });

  document.addEventListener("status-event", (e) => {
    const payload = e.detail;
    console.log(JSON.stringify(payload) + "00000000000");
    console.log(chatRoomList.value);
    const chatRoom = chatRoomList.value.find(
      (c) => c.opponentUuid === payload.memberUuid
    );
    if (chatRoom) {
      if (payload.memberUuid === chatRoom.opponentUuid) {
        chatRoom.status = payload.memberStatus;
      }
    }
  });

  await getChatList();
});

onUnmounted(() => {
  stompClient.unsubscribe("/sub/room");
});

watch(
  () => route.fullPath,
  () => {
    getChatList();
  }
);
</script>

<style scoped>
.chat-item {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  padding: 12px 16px;
}

.chat-item:hover {
  background-color: #f1f1f1;
}

.chat-right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.unread-badge {
  background-color: #ff4d4f;
  color: white;
  border-radius: 50%;
  min-width: 30px;
  height: 30px;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  animation: pop 0.3s ease;
}

@keyframes pop {
  0% {
    transform: scale(0.8);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

/* ✅ 상태 인디케이터 스타일 */
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