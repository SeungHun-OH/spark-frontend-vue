<template>
  <div>
    <div class="banner">
      <div class="banner-left">
        <div>
          <h2>Chats</h2>
          <small class="text-muted">Manage your posts and profile</small>
        </div>
      </div>
    </div>

    <ul class="list-group">
      <router-link
        v-for="(chat, i) in chats"
        :key="i"
        :to="`/chat/chatting/${chat.encodedUUID}`"
        class="list-group-item d-flex justify-content-between align-items-center chat-item"
      >
        <!-- 좌측 -->
        <div>
          <strong>{{ chat.chatRoomName }}</strong>, <small>{{ chat.age }}</small><br />
          <small class="text-muted">{{ chat.lastMessage }}</small>
        </div>

        <!-- 우측 -->
        <div class="text-end">
          <small class="text-muted">{{ formatTime(chat.date) }}</small>
          <div>
            <span v-if="chat.unreadCount > 0" class="badge bg-primary rounded-pill">
              {{ chat.unreadCount }}
            </span>
          </div>
        </div>
      </router-link>
    </ul>
  </div>
</template>

<script setup>
import chatApi from "@/apis/chatApi";
import { ref, onMounted, onUnmounted } from "vue";
import stompClient from "@/sockets/stompClient";

const chats = ref([]);

// ✅ 리스트 불러오기
async function getChatList() {
  const response = await chatApi.getChatList();
  chats.value = response.data.data;
}

// ✅ 실시간 이벤트 처리
function handleRoomEvent(event) {
  const room = chats.value.find((c) => c.encodedUUID === event.roomId);
  if (room) {
    room.lastMessage = event.lastMessage;
    room.date = event.lastMessageTime ?? room.date;
    room.unreadCount = event.unreadCount ?? room.unreadCount;
  }
}

// ✅ 시간 포맷 (오늘은 시간, 과거는 날짜)
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

// ✅ 마운트 시 실행
onMounted(async () => {
  await getChatList();

  stompClient.connect(() => {
    stompClient.subscribeRoomList((event) => {
      handleRoomEvent(event);
    });
  });
});

// ✅ 언마운트 시 구독만 해제
onUnmounted(() => {
  stompClient.unsubscribe(); // 연결은 유지, 리스트 구독만 해제
});
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
</style>