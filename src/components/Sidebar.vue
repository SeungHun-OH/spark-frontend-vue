<!-- 컴포넌트의 UI -->
<template>
  <aside class="sidebar">
    <div class="brand">
      <img src="../assets/logo.png" alt="icon" />
      <div>
        <h4 class="mb-0">Spark</h4>
      </div>
    </div>

    <nav class="mt-3">
      <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }"><i class="bi bi-house"></i> Main</router-link>
      <router-link to="/matching" class="nav-link" :class="{ active: $route.path === '/matching' }"><i class="bi bi-people"></i> Matching</router-link>
      <router-link to="/feed" class="nav-link" :class="{ active: $route.path === '/feed' }"><i class="bi bi-camera"></i> My Feed</router-link>
      <!-- Chats and Profile disabled per request -->
      <router-link to="/chat" class="nav-link" :class="{ active: $route.path === '/chat' }"><i class="bi bi-chat-dots"></i> Chats</router-link>
      <router-link to="/hearts" class="nav-link" :class="{ active: $route.path === '/hearts' }"><i class="bi bi-heart"></i> Hearts</router-link>

      <router-link v-if="store.getters['member/getJwt']" to="/Member/Profile" class="nav-link" :class="{ active: $route.path === '/Member/Profile' }">
        <i class="bi bi-person"></i> Profile
      </router-link>
      <router-link v-else to="/Member/Login" class="nav-link">
        <i class="bi bi-box-arrow-in-right"></i> Profile
      </router-link>

      <router-link to="/Thread/ThreadMain" class="nav-link" :class="{ active: $route.path === '/Thread/ThreadMain' }"><i class="bi bi-heart"></i> Thread</router-link>
    </nav>

    <!-- <div>
      <Example />
    </div> -->

    <div class="footer">
      <div class="d-flex align-items-center">
        <ProfileIcon />
      </div>
      <logout />
    </div>
  </aside>
</template>

<!-- 컴포넌트의 초기화 또는 이벤트 처리 -->
<script setup>
// import Example from '@/views/Member/Example.vue';
import Logout from './member/Logout.vue';
import ProfileIcon from './member/ProfileIcon.vue';
import { useStore } from 'vuex';

const store = useStore();

</script>

<!-- 컴포넌트 스타일 정의 -->
<style scoped>

.sidebar {
  background-color: var(--color-bg);
  color: var(--color-text);
}

</style>