<template>
  <div id="app" class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <img src="/../assets/logo.png" alt="logo" />
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
        <div class="d-flex align-items-center">
          <img src="https://i.pravatar.cc/48" class="rounded-circle me-2" />
          <div>
            <div class="fw-bold">Alex Johnson</div>
            <small class="text-muted">ffd@naver.com</small>
          </div>
        </div>
        <button class="btn btn-sm btn-danger mt-3 w-100">Logout</button>
      </div>
    </aside>

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
</script>
