<template>
  <div>
    <h3 class="mb-3">My Feed</h3>

    <!-- Profile header -->
    <div class="card mb-3" style="border-radius:12px; padding:22px; display:flex; gap:18px; align-items:center;">
      <img :src="`http://localhost:8040/member/memberPicture/${profile.mnickname}`" width="96" height="96"
        style="border-radius:50%;" />
      <div style="flex:1;">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <h4 class="mb-0">{{ profile.mname }}</h4>
            <small class="text-muted">6 posts · 156 followers · 89 following</small>
          </div>
        </div>

        <!-- 취미 태그 + 플러스 버튼 -->
        <div class="mt-2 d-flex flex-wrap gap-2 align-items-center">
          <div v-for="(h, i) in profile.mhobby" :key="i">
            <span class="badge bg-light text-dark">{{ h }}</span>
          </div>

          <button class="btn btn-sm btn-outline-secondary" @click="goPreferences">+</button>
        </div>
        <p class="mt-2 mb-0 text-muted">{{ profile.mbio }}</p>
      </div>
    </div>

    <!-- My Posts title + Add Post 버튼 -->
    <div class="d-flex align-items-center justify-content-between mb-3">
      <div class="d-flex align-items-center">
        <i class="bi bi-grid-3x3-gap-fill me-2"></i>
        <h5 class="mb-0">My Posts</h5>
      </div>
    </div>

    <!-- grid (hover 시 수정/삭제 버튼 표시) -->
    <div class="my-post-grid">
      <div class="post-item position-relative" v-for="p in feedNoList" :key="p.fNo" @click="openPost(p.fNo)">
        <img :src="`http://localhost:8040/feedPicture/picture/${p.fpNo}`" />
      </div>
    </div>

    <!-- modal for clicked post -->
    <div class="modal fade" tabindex="-1" :class="{ show: showModal }" style="display:block" v-if="showModal">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content" style="border-radius:12px;">
          <div class="modal-body p-0 d-flex">

            <div style="flex:1; position:relative;">
              <img v-if="modalPostPictures && modalPostPictures.length > 0"
                :src="`http://localhost:8040/feedPicture/picture/${modalPostPictures[currentImageIndex].fpNo}`"
                style="width:100%; height:80vh; object-fit:cover;" />

              <!-- 이전 버튼 -->
              <button v-if="modalPostPictures && currentImageIndex > 0" @click="prevImage"
                style="position:absolute; top:45%; left:10px; transform:translateY(-50%); font-size:8rem; background:none; border:none; color:white; cursor:pointer;">
                ‹
              </button>

              <!-- 다음 버튼 -->
              <button v-if="modalPostPictures && currentImageIndex < modalPostPictures.length - 1" @click="nextImage"
                style="position:absolute; top:45%; right:10px; transform:translateY(-50%); font-size:8rem; background:none; border:none; color:white; cursor:pointer;">
                ›
              </button>
            </div>

            <div style="width:420px; background:#fff; padding:20px;">
              <div class="d-flex align-items-center mb-3">
                <img :src="`http://localhost:8040/member/memberPicture/${modalAuthor.mNickname}`" class="rounded-circle me-2" width="48" height="48" />
                <div>
                  <div class="fw-bold">{{ modalAuthor.mName }}</div>
                  <small class="text-muted">{{ formatTimeAgo(modalPost.feed.fDate) }}</small>
                </div>
                <button class="btn-close ms-2" @click="closeModal()"></button>
              </div>
              <div>
                <div class="mb-3"><i class="bi bi-heart me-2"></i>45 <i class="bi bi-chat ms-3 me-2"></i>12</div>
                <div>{{ modalPost.feed.fContent }}</div>
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
import { useRouter } from 'vue-router';
import memberApi from '@/apis/memberApi';
import feedApi from '@/apis/feedApi';
import feedPictureApi from '@/apis/feedPictureApi';
import { formatTimeAgo } from '@/utils/time';
import memberCategoryApi from '@/apis/memberCategoryApi';
import member from '@/store/member';

const store = useStore();
const router = useRouter();

const profile = ref({
  mno: "",
  mname: "",
  mnickname: "",
  mbio: "",
  mhobby: [],
});

//피드
const feedNoList = ref([]);
const currentImageIndex = ref(0);
const showModal = ref(false);
//모달
const modalPost = ref([]);
const modalPostPictures = ref([]);
const modalAuthor = ref([]);

// ✅ 이동 함수들
function goPreferences() {
  router.push("/preferences");
}
function goCreatePost() {
  router.push("/create-post");
}
function goEditPost(fNo) {
  router.push(`/edit-post/${fNo}`);
}
function editPost(fNo) {
  router.push(`/edit-post/${fNo}`);
}
async function deletePost(fNo) {
  console.log(fNo);
  if (confirm("이 포스트를 삭제하시겠습니까?")) {
    try {
      await feedApi.deleteFeed(fNo);
      alert("삭제되었습니다.");
      getPosts();
    } catch (error) {
      console.log("삭제 실패 : ", error);
    }
  }
}

async function getProfile() {
  try {
    const response = await memberApi.selectMemberByMno();
    profile.value.mno = response.data.mNo;
    profile.value.mname = response.data.mName;
    profile.value.mnickname = response.data.mNickname;
    profile.value.mbio = response.data.mBio;

    const categoryResponse = await memberCategoryApi.getHobbyCategoriesByMemberNo();
    for (let i = 0; i < categoryResponse.data.data.length; i++) {
      profile.value.mhobby.push(categoryResponse.data.data[i].pcName);
    }

  } catch (error) {
    console.log(error);
  }
}

async function getPosts() {
  feedNoList.value = []; //기존 데이터 초기화

  const feedListResponse = await feedApi.getMyFeedList(1);
  const feedList = feedListResponse.data;

  const firstImgResponse = await feedPictureApi.getFirstImageofFeed();
  const firstImg = firstImgResponse.data.data;

  for (let i = 0; i < firstImg.length; i++) {
    feedNoList.value.push({
      fNo: firstImg[i].fpFeedNo,
      fpNo: firstImg[i].fpNo
    });
  }
}

async function openPost(fNo) {
  const feedResponse = await feedApi.getFeed(fNo);
  modalPost.value = feedResponse.data.data;

  const feedPictureResponse = await feedPictureApi.getFeedPictureList(fNo);
  modalPostPictures.value = feedPictureResponse.data.data;

  const profileResponse = await memberApi.selectMemberByMno();
  modalAuthor.value = profileResponse.data;

  currentImageIndex.value = 0;
  showModal.value = true;
  document.body.style.overflow = 'hidden';
}

function nextImage() {
  if (currentImageIndex.value < modalPostPictures.value.length - 1) {
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
  await getProfile();
  await getPosts();
});
</script>

<style scoped>
.my-post-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.post-item img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.hover-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: none;
}

.post-item:hover .hover-actions {
  display: flex;
}

.modal {
  background: rgba(10, 10, 10, 0.6);
}
</style>
