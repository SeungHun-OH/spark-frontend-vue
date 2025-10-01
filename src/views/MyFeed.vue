<template>
  <div>
    <h3 class="mb-3">My Feed</h3>

    <!-- Profile header (left aligned per screenshot) -->
    <div class="card mb-3" style="border-radius:12px; padding:22px; display:flex; gap:18px; align-items:center;">
      <img src="https://i.pravatar.cc/120" width="96" height="96" style="border-radius:50%;" />
      <div style="flex:1;">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <h4 class="mb-0">{{ profile.mname }}</h4>
            <small class="text-muted">6 posts · 156 followers · 89 following</small>
          </div>
          <div>
            <button class="btn btn-outline-secondary btn-sm me-2">Edit Profile</button>
            <button class="btn btn-outline-secondary btn-sm">Share Profile</button>
          </div>
        </div>
        <p class="mt-2 mb-0 text-muted">{{ profile.mbio }}</p>
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
      <div class="post-item" v-for="p, i in feedNoList" :key="i" @click="openPost(i)">
        <img :src="`http://localhost:8040/feedPicture/picture/${p.fpNo}`" />
      </div>
    </div>

    <!-- modal for clicked post -->
    <div class="modal fade" tabindex="-1" :class="{ show: showModal }" style="display:block" v-if="showModal">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content" style="border-radius:12px;">
          <div class="modal-body p-0 d-flex">

            <div style="flex:1; position:relative;">
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

            <div style="width:420px; background:#fff; padding:20px;">
              <div class="d-flex align-items-center mb-3">
                <img src="https://i.pravatar.cc/48" class="rounded-circle me-2" width="48" height="48" />
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
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import memberApi from '@/apis/memberApi';
import feedApi from '@/apis/feedApi';
import feedPictureApi from '@/apis/feedPictureApi';
// import { getPrototypeOf } from 'core-js/core/object';
// import { cosh } from 'core-js/core/number';

const store = useStore();

const profile = ref({
  mno: "",
  mname: "",
  mbio: ""
});

const feedNoList = ref([]);

const currentImageIndex = ref(0);
const showModal = ref(false);
const selectedIndex = ref(0);

async function getProfile() {
  try {
    const response = await memberApi.memberGet("test4");
    profile.value.mno = response.data.data.m_no;
    profile.value.mname = response.data.data.m_name;
    profile.value.mbio = response.data.data.m_bio;
  } catch (error) {
    console.log(error);
  }
}

async function getPosts() {
  //1. feed List 가져오기
  const feedListResponse = await feedApi.getFeedList(profile.value.mno, 1);
  const feedList = feedListResponse.data;

  //2. 각 feed의 첫번째 이미지 가져오기
  const firstImgResponse = await feedPictureApi.getFirstImageofFeed(profile.value.mno);
  const firstImg = firstImgResponse.data;

  for (let i = 0; i < firstImg.length; i++) {
    feedNoList.value.push({
      fNo: firstImg[i].fNo, //feed 번호
      fpNo: firstImg[i].fpNo, //첫번째 이미지 번호
    });
  }
}

function openPost(i) {
  const post = feedNoList.value[i];
  
  selectedIndex.value = i;
  showModal.value = true;
  document.body.style.overflow = 'hidden';
}

function nextImage() {
  if (currentImageIndex.value < selectedIndex.value.images.length - 1) {
    currentImageIndex.value++;
  }
}

function prevImage() {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
}

function closeModal() {
  showModal.value = false;
  document.body.style.overflow = 'auto';
}

onMounted(async () => {
  await getProfile(); //1.프로필 먼저 불러오기
  await getPosts();   //2. mno가 들어간 뒤 포스트 불러오기
});
</script>

<style scoped>
.modal {
  background: rgba(10, 10, 10, 0.6);
}
</style>