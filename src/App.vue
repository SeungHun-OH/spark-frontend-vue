<template>
  <div id="app" class="app-shell">
    <sidebar></sidebar>

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

<script setup>
import Sidebar from './components/Sidebar.vue';

</script>
