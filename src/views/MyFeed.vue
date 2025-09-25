<template>
  <div>
    <h3 class="mb-3">My Feed</h3>

    <!-- Profile header -->
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

    <!-- My Posts -->
    <div class="my-posts-title">
      <div class="d-flex align-items-center">
        <i class="bi bi-grid-3x3-gap-fill me-2"></i>
        <h5 class="mb-0">My Posts</h5>
      </div>
    </div>

    <!-- Grid (3 columns) -->
    <div class="my-post-grid">
      <div class="post-item" v-for="(p, i) in posts" :key="i">
        <img :src="p.images[0]" @click="openPost(i)" />
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" tabindex="-1" :class="{ show: showModal }" style="display:block" v-if="showModal">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content" style="border-radius:12px;">
          <div class="modal-body p-0 d-flex">

            <!-- 이미지 영역 -->
            <div style="flex:1; position:relative;" v-if="modalPost">
              <img :src="modalPost.images[currentImageIndex]" style="width:100%; height:80vh; object-fit:cover;" />

              <!-- 이전 버튼 -->
              <button v-if="currentImageIndex > 0" @click="prevImage"
                style="position:absolute; top:45%; left:10px; transform:translateY(-50%); font-size:8rem; background:none; border:none; color:white; cursor:pointer;">
                ‹
              </button>
              
              <!-- 다음 버튼 -->
              <button v-if="currentImageIndex < modalPost.images.length - 1" @click="nextImage"
                style="position:absolute; top:45%; right:10px; transform:translateY(-50%); font-size:8rem; background:none; border:none; color:white; cursor:pointer;">
                ›
              </button>
            </div>

            <!-- 우측 정보 -->
            <div style="width:420px; background:#fff; padding:20px;">
              <div class="d-flex align-items-center mb-3">
                <img src="https://i.pravatar.cc/48" class="rounded-circle me-2" width="48" height="48" />
                <div>
                  <div class="fw-bold">Alex Johnson</div>
                  <small class="text-muted" > {{feed.state.date}} </small>
                </div>
                <button class="btn-close ms-auto" @click="closeModal()"></button>
              </div>
              <div>
                <div class="mb-3"><i class="bi bi-heart me-2"></i>45 <i class="bi bi-chat ms-3 me-2"></i>12</div>
                <!--feed.-->
                <div><strong>Alex</strong> {{feed.state.content}} </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import feed from '@/store/feed';
import { ref } from 'vue'
import { useRoute } from 'vue-router';
import { useStore } from 'vuex'
import feedApi from '@/apis/feedApi';

const store = useStore();
const route = useRoute();

/* 게시물 (여러 장 이미지 지원) */
const posts = ref([
  { images: ['https://picsum.photos/500/500?img=11', 'https://picsum.photos/500/500?img=12'] },
  { images: ['https://picsum.photos/500/500?img=13'] },
  { images: ['https://picsum.photos/500/500?img=14', 'https://picsum.photos/500/500?img=15', 'https://picsum.photos/500/500?img=16'] }
])

/* 모달 상태 */
const modalPost = ref(null)
const currentImageIndex = ref(0)
const showModal = ref(false)

/* 게시물 클릭 -> 모달 열기 */
function openPost(i) {
  modalPost.value = posts.value[i]
  currentImageIndex.value = 0
  showModal.value = true
  document.body.style.overflow = 'hidden'
}

/* 모달 닫기 */
function closeModal() {
  modalPost.value = null
  showModal.value = false
  document.body.style.overflow = 'auto'
}

/* 다음/이전 이미지 */
function nextImage() {
  if (modalPost.value && currentImageIndex.value < modalPost.value.images.length - 1) {
    currentImageIndex.value++
  }
}
function prevImage() {
  if (modalPost.value && currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}
</script>

<style scoped>
.modal {
  background: rgba(10, 10, 10, 0.6);
}

.my-post-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.my-post-grid .post-item img {
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  cursor: pointer;
}
</style>
