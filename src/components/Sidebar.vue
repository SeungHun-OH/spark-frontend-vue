<template>
  <div class="d-flex flex-column bg-white border-end vh-100" style="width: 250px;">
    <div class="p-3 text-center border-bottom">
      <img src="#" alt="Logo" width="40" class="mb-2" />
      <h5 class="fw-bold">스파크</h5>
    </div>
    <ul class="nav flex-column mt-3">
      <li v-for="(item, i) in menu" :key="i" class="nav-item">
        <router-link :to="item.link" class="nav-link text-dark d-flex align-items-center px-3 py-2"
          active-class="active bg-dark text-white rounded">
          <i :class="item.icon + ' me-2'"></i>{{ item.name }}
        </router-link>
      </li>
    </ul>
    <div class="mt-auto p-3 border-top">
      <div class="d-flex align-items-center">
        <img src="https://i.pravatar.cc/40" class="rounded-circle me-2" />
        <div>
          <strong>Alex Johnson</strong><br />
          <small class="text-muted">ffd@naver.com</small>
        </div>
      </div>
      <button class="btn btn-sm btn-outline-danger mt-3 w-100">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const menu = ref([
  { name: "Main", icon: "bi bi-house", link: "/" },
  { name: "Matching", icon: "bi bi-people", link: "/matching" },
  { name: "My Feed", icon: "bi bi-camera", link: "/feed" },
  { name: "Chats", icon: "bi bi-chat-dots", link: "/chats" },
  { name: "Hearts", icon: "bi bi-heart", link: "/hearts" },
  { name: "Profile", icon: "bi bi-person", link: "/profile" }
]);
</script>


