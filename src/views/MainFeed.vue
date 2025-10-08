<template>
  <div>
    <!-- 상단 배너 -->
    <div class="banner mb-4 d-flex justify-content-between align-items-center">
      <div class="banner-left">
        <div>
          <h2>Discover</h2>
          <small class="text-muted">Explore posts from others</small>
        </div>
      </div>

      <div class="category-tabs">
        <button class="btn btn-light btn-sm" @click="reloadFeeds">All</button>
        <button class="btn btn-light btn-sm">Following</button>
        <button class="btn btn-light btn-sm">Nearby</button>
        <button class="btn btn-light btn-sm">Popular</button>
      </div>
    </div>

    <!-- 메인 피드 -->
    <div>
      <div v-for="post in posts" :key="post.feed.fNo" class="feed-card mb-4">
        <div class="feed-header">
          <img
            :src="`http://localhost:8040/member/memberPicture/${post.member.mNickname}`"
            alt="avatar"
            class="rounded-circle me-2"
            width="48"
            height="48"
          />
          <div style="flex:1">
            <div class="fw-bold">{{ post.member.mName }}</div>
            <small class="text-muted">{{ formatTimeAgo(post.feed.fDate) }}</small>
          </div>
          <div class="text-muted"><i class="bi bi-three-dots"></i></div>
        </div>

        <!-- 대표 이미지 -->
        <img
          v-if="post.firstImage"
          :src="`http://localhost:8040/feedPicture/picture/${post.firstImage.fpNo}`"
          class="feed-image mt-2"
          @click="openModal(post.feed.fNo)"
        />

        <div class="feed-actions mt-2">
          <button class="btn btn-light btn-sm me-2"><i class="bi bi-heart"></i></button>
          <button class="btn btn-light btn-sm"><i class="bi bi-chat"></i></button>
        </div>

        <div class="feed-stats mt-2">
          <div class="mb-2"><strong>{{ post.feed.likes || 0 }}</strong> likes</div>
          <div><strong>{{ post.member.mName }}</strong> {{ post.feed.fContent }}</div>
        </div>
      </div>
    </div>

    <!-- 모달 (피드 상세보기) -->
    <div
      class="modal fade"
      tabindex="-1"
      :class="{ show: showModal }"
      style="display:block"
      v-if="showModal"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content" style="border-radius:12px;">
          <div class="modal-body p-0 d-flex">
            <!-- 왼쪽: 사진 -->
            <div style="flex:1; position:relative;">
              <img
                v-if="modalPictures.length > 0"
                :src="`http://localhost:8040/feedPicture/picture/${modalPictures[currentImageIndex].fpNo}`"
                style="width:100%; height:80vh; object-fit:cover;"
              />

              <!-- 이전 버튼 -->
              <button
                v-if="currentImageIndex > 0"
                @click="prevImage"
                style="position:absolute; top:45%; left:10px; transform:translateY(-50%);
                       font-size:8rem; background:none; border:none; color:white; cursor:pointer;">‹</button>

              <!-- 다음 버튼 -->
              <button
                v-if="currentImageIndex < modalPictures.length - 1"
                @click="nextImage"
                style="position:absolute; top:45%; right:10px; transform:translateY(-50%);
                       font-size:8rem; background:none; border:none; color:white; cursor:pointer;">›</button>
            </div>

            <!-- 오른쪽: 게시글 내용 -->
            <div style="width:420px; background:#fff; padding:20px;">
              <div class="d-flex align-items-center mb-3">
                <img
                  :src="`http://localhost:8040/member/memberPicture/${modalAuthor.mNickname}`"
                  class="rounded-circle me-2"
                  width="48"
                  height="48"
                />
                <div>
                  <div class="fw-bold">{{ modalAuthor.mName }}</div>
                  <small class="text-muted">{{ formatTimeAgo(modalFeed.fDate) }}</small>
                </div>
                <button class="btn-close ms-auto" @click="closeModal()"></button>
              </div>
              <div>
                <div class="mb-3"><strong>{{ modalFeed.likes || 0 }}</strong> likes</div>
                <div><strong>{{ modalAuthor.mName }}</strong> {{ modalFeed.fContent }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 로딩 표시 -->
    <div v-if="loading" class="text-center text-muted my-3">Loading...</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import feedApi from "@/apis/feedApi";
import feedPictureApi from "@/apis/feedPictureApi";
import memberApi from "@/apis/memberApi";
import { formatTimeAgo } from "@/utils/time";

const posts = ref([]);
const loading = ref(false);
const page = ref(1);
const myNickname = ref("");

// 모달 관련
const showModal = ref(false);
const modalFeed = ref({});
const modalPictures = ref([]);
const modalAuthor = ref({});
const currentImageIndex = ref(0);

// 닉네임 가져오기
async function getMyNickname() {
  try {
    const res = await memberApi.selectMemberByMno();
    myNickname.value = res.data.mNickname;
  } catch (e) {
    console.error("닉네임 가져오기 실패:", e);
  }
}

// ✅ 피드 목록 불러오기 (내 피드 제외)
async function loadFeeds() {
  if (loading.value) return;
  loading.value = true;

  try {
    if (!myNickname.value) await getMyNickname();

    const response = await feedApi.getFeedList(myNickname.value, page.value);
    const feedList = response.data.data || response.data;

    for (const feed of feedList) {
      const picRes = await feedPictureApi.getFeedPictureList(feed.fNo);
      const pictures = picRes.data.data || [];
      const firstImage = pictures[0] || null;

      const authorRes = await memberApi.selectMemberByMno(feed.fMemberno);
      const author = authorRes.data;

      posts.value.push({
        feed,
        firstImage,
        member: author,
      });
    }

    page.value++;
  } catch (e) {
    console.error("피드 로드 실패:", e.response?.data || e);
  } finally {
    loading.value = false;
  }
}

// 모달 열기
async function openModal(fNo) {
  const feedRes = await feedApi.getFeed(fNo);
  modalFeed.value = feedRes.data.data;

  const picsRes = await feedPictureApi.getFeedPictureList(fNo);
  modalPictures.value = picsRes.data.data || [];

  const authorRes = await memberApi.selectMemberByMno(modalFeed.value.fMemberno);
  modalAuthor.value = authorRes.data;

  currentImageIndex.value = 0;
  showModal.value = true;
  document.body.style.overflow = "hidden";
}

// 모달 닫기
function closeModal() {
  showModal.value = false;
  document.body.style.overflow = "auto";
}
function nextImage() {
  if (currentImageIndex.value < modalPictures.value.length - 1) currentImageIndex.value++;
}
function prevImage() {
  if (currentImageIndex.value > 0) currentImageIndex.value--;
}

// 새로고침 버튼
function reloadFeeds() {
  posts.value = [];
  page.value = 1;
  loadFeeds();
}

onMounted(async () => {
  await getMyNickname();
  await loadFeeds();
});
</script>

<style scoped>
.modal {
  background: rgba(10, 10, 10, 0.6);
}
.feed-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.08);
  padding: 16px;
}
.feed-header {
  display: flex;
  align-items: center;
}
.feed-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
}
.banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.category-tabs button {
  margin-left: 8px;
}
</style>
