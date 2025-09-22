<script setup>
import AppHeader from './components/member/AppHeader.vue'
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <div class="d-flex flex-column flex-grow-1">
    <!-- 상단 헤더 -->
    <AppHeader />

    <header class="topbar d-flex justify-content-between align-items-center">
      <div class="fw-bold">Dating App (Community)</div>
      <div>
        <button class="btn btn-outline-secondary btn-sm me-2">?</button>
        <button class="btn btn-primary btn-sm">공유하기</button>
      </div>
    </header>

    <!-- 네비게이션 -->
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/Member/Login">Login</router-link> |
      <router-link to="/Member/Sign">Sign</router-link> |
    </nav>

    <!-- 본문 -->
    <div class="content-wrap d-flex">
      <Sidebar />
      <main class="content flex-grow-1">
        <router-view />
      </main>
    </div>
  </div>
</template>
