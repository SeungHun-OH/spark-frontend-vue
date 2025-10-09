<template>
  <div id="app">
    <!-- 로그인 페이지일 땐 전체 레이아웃 없이 login view만 표시 -->
    <template v-if="isLoginPage">
      <router-view />
    </template>

    <!-- 그 외 페이지는 기존 레이아웃 유지 -->
    <template v-else>
      <div class="app-shell">
        <Sidebar />

        <div class="d-flex flex-column flex-grow-1">
          <header class="topbar">
            <div class="fw-bold">Dating App (Community)</div>
            <div>
              <button class="btn btn-outline-secondary btn-sm me-2">?</button>
              <button class="btn btn-primary btn-sm">공유하기</button>
            </div>
          </header>

          <div class="content-wrap">
            <main class="content">
              <router-view />
            </main>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import Sidebar from './components/Sidebar.vue'
import { onMounted } from "vue";
import { useStore } from "vuex";
import { getMemberInfoByToken } from "@/apis/login";
import { loginSuccess } from "@/apis/axiosConfig"

const route = useRoute()
const store = useStore();
// 로그인 페이지 여부 확인 (경로 또는 meta 활용 가능)
const isLoginPage = computed(() => route.path === '/login')
const router = useRouter();

onMounted(async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      loginSuccess(token);
      const response = await getMemberInfoByToken();
      console.log(JSON.stringify(response.data.data) + " 새로고침");
      const memberInfo = response.data.data;
      store.commit("auth/setMemberUuid", memberInfo.uuid)
      store.commit("auth/setJwtToken", token)
    } catch (e) {
      console.error("토큰 만료 또는 인증 실패", e);
      localStorage.removeItem("token");
      // router.push('/login')
    }
  } else {
    // router.push('/login')
  }
});

</script>
