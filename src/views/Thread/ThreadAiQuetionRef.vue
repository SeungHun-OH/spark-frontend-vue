<template>
  <div class="board-modal">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h6 class="fw-bold mb-0">📚 참고한 게시글</h6>
      <button class="btn btn-sm btn-outline-light" @click="$emit('close')">닫기</button>
    </div>

    <div class="board-list">
      <div v-for="(b, i) in boards" :key="i" class="board-item mb-3 p-3 rounded border shadow-sm">
        <h6 class="fw-semibold mb-2 board-title">
          📌 {{ b.tbTitle || `참고글 ${i + 1}` }}
        </h6>
        <p class="board-content">
          {{ b.tbContent }}
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
defineProps({
  boards: { type: Array, default: () => [] },
});
</script>

<style scoped>
.board-modal {
  background: #2a2a2a;
  color: #fff;
  border-radius: 10px;
  padding: 20px;
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
}

.board-list {
  max-height: 70vh;
  overflow-y: auto;
}

.board-content {
  font-size: 0.875rem;   /* ← 바로 이 부분이 본문 글자 크기 */
  line-height: 1.6;     /* 줄 간격 */
  white-space: pre-line;
  opacity: 0.85;
}
</style>
