<!-- 컴포넌트의 UI -->
<template>
    <aside class="sidebar">
      <div class="brand">
        <img src="../assets/logo.png" alt="logo" />
        <div><h4 class="mb-0">Spark</h4></div>
      </div>

      <nav class="mt-3">
        <router-link to="/" class="nav-link" :class="{active: $route.path === '/'}"><i class="bi bi-house"></i> Main</router-link>
        <router-link to="/matching" class="nav-link" :class="{active: $route.path === '/matching'}"><i class="bi bi-people"></i> Matching</router-link>
        <router-link to="/feed" class="nav-link" :class="{active: $route.path === '/feed'}"><i class="bi bi-camera"></i> My Feed</router-link>
        <!-- Chats and Profile disabled per request -->
        <a class="nav-link disabled" href="#" title="Chats disabled"><i class="bi bi-chat-dots"></i> Chats</a>
        <router-link to="/hearts" class="nav-link" :class="{active: $route.path === '/hearts'}"><i class="bi bi-heart"></i> Hearts</router-link>
        <a class="nav-link disabled" href="#" title="Profile disabled"><i class="bi bi-person"></i> Profile</a>
      </nav>

      <div class="footer">
        <div>

          <ProfileIcon/>
          <Logout/>

        </div>
        <div class="d-flex align-items-center">
  
          
        </div>
      </div>

    </aside>
</template>

<!-- 컴포넌트의 초기화 또는 이벤트 처리 -->
<script setup>
import Logout from './member/Logout.vue';
import ProfileIcon from './member/ProfileIcon.vue';

    
</script>

<!-- 컴포넌트 스타일 정의 -->
<style scoped>
.layout {
  display: flex;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  background: #fff;
  border-right: 1px solid #ddd;
  padding: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.main-content img {
  width: 100%;        /* 부모 컨테이너 너비에 딱 맞춤 */
  height: auto;       /* 세로는 비율 유지 */
  object-fit: contain; /* 잘리지 않고 비율 유지 */
  display: block;     /* inline 간격 없애기 */
}

/* 이미지 반응형 */
.main-content img {
  max-width: 100%;
  height: auto;
  display: block;
}

.footer {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;  /* 컴포넌트 간격 */
  align-items: center; /* 가운데 정렬 */
}

</style>
