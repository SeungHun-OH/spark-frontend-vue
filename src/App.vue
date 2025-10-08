<template>
  <div id="app" :class="['app-shell', { dark: isDarkMode }]">
    <!-- 🌙 사이드바 -->
    <sidebar />

    <!-- 🌞 메인 콘텐츠 -->
    <div class="d-flex flex-column flex-grow-1">
      <header class="topbar d-flex justify-content-between align-items-center p-3">
        <div class="fw-bold">Dating App (Community)</div>

        <div>
          <!-- 테마 전환 버튼 -->
          <button class="btn btn-outline-secondary btn-sm me-2" @click="toggleTheme">
            {{ isDarkMode ? '☀️ Light' : '🌙 Dark' }}
          </button>
          <button class="btn btn-primary btn-sm">공유하기</button>
        </div>
      </header>

      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue';
import { ref, watchEffect } from 'vue';

// ✅ 테마 CSS 파일 두 개 모두 불러오기
import './assets/theme-light.css';
import './assets/theme-dark.css';

// ✅ 현재 테마 상태 불러오기
// (처음 페이지 로드 시 localStorage에 저장된 값이 'dark'면 다크모드로 시작)
const isDarkMode = ref(localStorage.getItem('theme') === 'dark');

// ✅ 테마 전환 함수
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  // ✅ 버튼 누를 때마다 localStorage에 저장
  // 다크모드면 'dark', 라이트모드면 'light'
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};

// ✅ 테마가 바뀔 때마다 body에 data-theme 속성 추가 (선택사항)
watchEffect(() => {
  document.body.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light');
});
</script>

<style>
/* 기본 여백 제거용 (선택사항) */
body, html, #app {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
