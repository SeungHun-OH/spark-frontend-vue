<template>
  <div class="menu-bar p-3">
    <h5 class="fw-bold mb-4">📌 Menu</h5>
    <ul class="list-unstyled">
      <li class="mb-2"><a href="#" class="text-decoration-none">🏠 Home</a></li>
      <li class="mb-2"><a href="#" class="text-decoration-none">👥 Matching</a></li>
      <li class="mb-2"><a href="#" class="text-decoration-none">📰 My Feed</a></li>
      <li class="mb-2"><a href="#" class="text-decoration-none">💬 Chats</a></li>
      <li class="mb-2"><a href="#" class="text-decoration-none">❤️ Hearts</a></li>
      <li class="mb-2"><a href="#" class="text-decoration-none">🙍 Profile</a></li>
    </ul>
  </div>
</template>

<script setup>
// script setup에서는 별도 export default 필요 없음
</script>

<style scoped>
.menu-bar {
  width: 200px;
  min-height: 100vh;
  border-right: 1px solid #ddd;
  background: #fafafa;
}
</style>
