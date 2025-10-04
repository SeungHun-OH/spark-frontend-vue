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
      <router-link v-for="(chatRoom, i) in chatRoomList" :key="i" :to="`/chat/chatting/${chatRoom.encodedUUID}`"
        class="list-group-item d-flex justify-content-between align-items-center chat-item">
        <!-- 좌측 -->
        <div>
          <strong>{{ chatRoom.chatRoomName }}</strong>, <small>{{ chatRoom.age }}</small><br />
          <small class="text-muted">{{ chatRoom.lastMessage }}</small>
        </div>

        <!-- 우측 -->
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
import { ref, onMounted, onUnmounted } from "vue";
import stompClient from "@/sockets/stompClient";

const chatRoomList = ref([]);

// ✅ 리스트 불러오기
async function getChatList() {
  const response = await chatApi.getChatList();
  chatRoomList.value = response.data.data;
}

// ✅ 서버에서 발행한 ChatRoomEvent 처리
function handleRoomEvent(event) {
  // event 구조: { lastMessage, chatRoomBase62RoomUUID, lastMessageDate }
  const room = chatRoomList.value.find(
    (c) => c.encodedUUID === event.chatRoomBase62RoomUUID
  );
  if (room) {
    room.lastMessage = event.lastMessage;
    room.date = event.lastMessageDate ?? room.date;
    room.unreadCount++;
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
  stompClient.unsubscribe();
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

.chat-right {
  display: flex;
  align-items: center;
  gap: 8px;              /* 시간과 뱃지 사이 간격 */
  margin-left: auto;     /* 오른쪽 끝으로 밀기 */
}

.chat-right {
  display: flex;
  align-items: center;
  gap: 8px;              /* 시간과 뱃지 사이 간격 */
  margin-left: auto;     /* 오른쪽 끝으로 밀기 */
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
  0% { transform: scale(0.8); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
</style>