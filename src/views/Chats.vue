<template>
  <div>
    <h4>Chats</h4>
    <ul class="list-group">
      <li v-for="(chat, i) in chats" :key="i" class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <strong>{{ chat.name }}</strong><br />
          <small>{{ chat.lastMessage }}</small>
        </div>
        <span class="badge bg-primary rounded-pill">{{ chat.unread }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const chats = ref([
  { name: "Emma", lastMessage: "See you soon!", unread: 2 },
  { name: "Jordan", lastMessage: "How was your day?", unread: 0 },
  { name: "Sophia", lastMessage: "Let's meet tomorrow", unread: 1 }
]);
</script>
