<template>
  <div id="app" :class="['app-shell', { dark: isDarkMode }]">
    <!-- ✅ 로그인 상태 -->
    <template v-if="isLoggedIn">
      <Sidebar />
      <div class="d-flex flex-column flex-grow-1">
        <header class="topbar d-flex justify-content-between align-items-center p-3">
          <div class="fw-bold">Dating App (Community)</div>
          <div>
            <button class="btn btn-outline-secondary btn-sm me-2" @click="toggleTheme">
              {{ isDarkMode ? '☀️ Light' : '🌙 Dark' }}
            </button>
            <button v-if="isLoggedIn" class="btn btn-primary btn-sm">공유하기</button>
          </div>
        </header>

        <main class="content">
          <router-view />
        </main>
      </div>
    </template>

    <!-- ❌ 로그아웃 상태 (헤더 제외 전체 중앙 배치) -->
    <template v-else>
      <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100%;">
        <login />
      </div>
    </template>
  </div>
</template>


<script setup>
import Sidebar from './components/Sidebar.vue';
import login from './views/Member/Login/index.vue';
import { ref, watchEffect } from 'vue';

// ✅ 테마 CSS 불러오기
import './assets/theme-light.css';
import './assets/theme-dark.css';

// ✅ 다크모드 상태
const isDarkMode = ref(localStorage.getItem('theme') === 'dark');

// ✅ 로그인 상태 (JWT 존재 여부로 판별)
const isLoggedIn = ref(!!localStorage.getItem('jwt'));

// ✅ 테마 전환
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};

// ✅ 테마 변경 시 body 속성도 동기화
watchEffect(() => {
  document.body.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light');
});

// ✅ storage 변경 감지 (다른 탭이나 로그아웃 이벤트 반영용)
window.addEventListener('storage', () => {
  isLoggedIn.value = !!localStorage.getItem('jwt');
});


</script>

<style>
body,
html,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>


<!-- <template>
  <div id="app" :class="['app-shell', { dark: isDarkMode }]">
    <sidebar />

    <div class="d-flex flex-column flex-grow-1">
      <header class="topbar d-flex justify-content-between align-items-center p-3">
        <div class="fw-bold">Dating App (Community)</div>

        <div>
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
body, html, #app {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style> -->
