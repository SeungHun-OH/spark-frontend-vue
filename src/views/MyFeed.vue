<template>
  <div>
    <h3 class="mb-3">My Feed</h3>

    <!-- Profile header (left aligned per screenshot) -->
    <div class="card mb-3" style="border-radius:12px; padding:22px; display:flex; gap:18px; align-items:center;">
      <img src="https://i.pravatar.cc/120" width="96" height="96" style="border-radius:50%;" />
      <div style="flex:1;">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <h4 class="mb-0">Alex Johnson</h4>
            <small class="text-muted">6 posts · 156 followers · 89 following</small>
          </div>
          <div>
            <button class="btn btn-outline-secondary btn-sm me-2">Edit Profile</button>
            <button class="btn btn-outline-secondary btn-sm">Share Profile</button>
          </div>
        </div>
        <p class="mt-2 mb-0 text-muted">Software engineer who loves cooking, traveling, and meeting new people.</p>
        <div class="mt-2">
          <span class="badge bg-light text-dark me-1">Cooking</span>
          <span class="badge bg-light text-dark me-1">Travel</span>
          <span class="badge bg-light text-dark me-1">Photography</span>
          <span class="badge bg-light text-dark me-1">Hiking</span>
        </div>
      </div>
    </div>

    <!-- My Posts title like screenshot -->
    <div class="my-posts-title">
      <div class="d-flex align-items-center">
        <i class="bi bi-grid-3x3-gap-fill me-2"></i>
        <h5 class="mb-0">My Posts</h5>
      </div>
    </div>

    <!-- grid exactly like provided image (3 columns) -->
    <div class="my-post-grid">
      <div class="post-item" v-for="(p,i) in posts" :key="i">
        <img :src="p" @click="openPost(i)" />
      </div>
    </div>

    <!-- modal for clicked post -->
    <div class="modal fade" tabindex="-1" :class="{show:showModal}" style="display:block" v-if="showModal">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content" style="border-radius:12px;">
          <div class="modal-body p-0 d-flex">
            <div style="flex:1">
              <img :src="posts[selectedIndex]" style="width:100%; height:80vh; object-fit:cover;" />
            </div>
            <div style="width:420px; background:#fff; padding:20px;">
              <div class="d-flex align-items-center mb-3">
                <img src="https://i.pravatar.cc/48" class="rounded-circle me-2" width="48" height="48"/>
                <div>
                  <div class="fw-bold">Alex Johnson</div>
                  <small class="text-muted">2 days ago</small>
                </div>
                <button class="btn-close ms-auto" @click="closeModal()"></button>
              </div>
              <div>
                <div class="mb-3"><i class="bi bi-heart me-2"></i>45 <i class="bi bi-chat ms-3 me-2"></i>12</div>
                <div><strong>Alex</strong> Great day out! 🌞</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
const posts = ref([
  'https://picsum.photos/500/500?img=11',
  'https://picsum.photos/500/500?img=12',
  'https://picsum.photos/500/500?img=13',
  'https://picsum.photos/500/500?img=14',
  'https://picsum.photos/500/500?img=15',
  'https://picsum.photos/500/500?img=16'
]);
const showModal = ref(false);
const selectedIndex = ref(0);
function openPost(i){ selectedIndex.value = i; showModal.value = true; document.body.style.overflow='hidden'; }
function closeModal(){ showModal.value = false; document.body.style.overflow='auto'; }
</script>
