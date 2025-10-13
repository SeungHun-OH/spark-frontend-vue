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
            style="cursor: pointer;"
            @click="goOtherFeed(post.member.mNo)"
          />
          <div
            style="flex:1; cursor: pointer;"
            @click="goOtherFeed(post.member.mNo)"
          >
            <div class="fw-bold">{{ post.member.mName }}</div>
            <small class="text-muted">{{ formatTimeAgo(post.feed.fDate) }}</small>
          </div>
          <div class="text-muted"><i class="bi bi-three-dots"></i></div>
        </div>

        <!-- 이미지 + 네비게이션 -->
        <div class="feed-image-wrapper position-relative mt-2">
          <img
            v-if="post.pictures.length > 0"
            :src="`http://localhost:8040/feedPicture/picture/${post.pictures[post.currentImageIndex].fpNo}`"
            class="feed-image"
            @click="openModal(post)"
          />

          <!-- 좌우 화살표 -->
          <button
            v-if="post.currentImageIndex > 0"
            class="arrow-btn left"
            @click.stop="changeImage(post.pictures, post, 'prev')"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
          <button
            v-if="post.currentImageIndex < post.pictures.length - 1"
            class="arrow-btn right"
            @click.stop="changeImage(post.pictures, post, 'next')"
          >
            <i class="bi bi-chevron-right"></i>
          </button>

          <!-- 점 표시 -->
          <div class="dots-indicator">
            <span
              v-for="(pic, idx) in post.pictures"
              :key="idx"
              :class="{ active: idx === post.currentImageIndex }"
            ></span>
          </div>
        </div>

        <!-- 액션 아이콘 -->
        <div class="feed-actions ">
          <i
            :class="post.isLiked ? 'bi bi-heart-fill text-danger fs-4 me-2' : 'bi bi-heart fs-4 me-2'"
            style="cursor:pointer;"
            @click="toggleLike(post)"
          ></i>
          <i
            class="bi bi-chat"
            style="cursor:pointer;"
            @click="openModal(post)"
          ></i>
        </div>

        <div class="feed-stats">
          <div class="mb-2"><strong>{{ post.feed.likes || 0 }}</strong> likes</div>
          <div><strong>{{ post.member.mName }}</strong> {{ post.feed.fContent }}</div>
        </div>
      </div>
    </div>

    <!-- 스크롤 트리거 -->
    <div ref="scrollTrigger" class="text-center text-muted my-3">
      <template v-if="loading">Loading...</template>
      <template v-else-if="!hasMore">You've reached the end.</template>
    </div>

    <!-- 모달 -->
    <div
      class="modal fade"
      tabindex="-1"
      :class="{ show: showModal }"
      style="display:block"
      v-if="showModal && modalPost"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content" style="border-radius:12px;">
          <div class="modal-body p-0 d-flex">
            <!-- 왼쪽: 사진 -->
            <div style="flex:1; position:relative;">
              <img
                v-if="modalPost.pictures.length > 0"
                :src="`http://localhost:8040/feedPicture/picture/${modalPost.pictures[currentImageIndex].fpNo}`"
                style="width:100%; height:80vh; object-fit:cover;"
              />

              <!-- 좌우 화살표 -->
              <button
                v-if="currentImageIndex > 0"
                class="arrow-btn left"
                @click="changeImage(modalPost.pictures, null, 'prev')"
              >
                <i class="bi bi-chevron-left"></i>
              </button>
              <button
                v-if="currentImageIndex < modalPost.pictures.length - 1"
                class="arrow-btn right"
                @click="changeImage(modalPost.pictures, null, 'next')"
              >
                <i class="bi bi-chevron-right"></i>
              </button>

              <!-- 점 표시 -->
              <div class="dots-indicator modal-dots">
                <span
                  v-for="(pic, idx) in modalPost.pictures"
                  :key="idx"
                  :class="{ active: idx === currentImageIndex }"
                ></span>
              </div>
            </div>

            <!-- 오른쪽: 게시글 내용 -->
            <div style="width:420px; background:#fff; padding:20px;">
              <div class="d-flex align-items-center mb-3">
                <img
                  :src="`http://localhost:8040/member/memberPicture/${modalPost.member.mNickname}`"
                  class="rounded-circle me-2"
                  width="48"
                  height="48"
                />
                <div>
                  <div class="fw-bold">{{ modalPost.member.mName }}</div>
                  <small class="text-muted">{{ formatTimeAgo(modalPost.feed.fDate) }}</small>
                </div>
                <button class="btn-close ms-auto" @click="closeModal()"></button>
              </div>
              <div>
                <div class="mb-3"><strong>{{ modalPost.feed.likes || 0 }}</strong> likes</div>
                <div><strong>{{ modalPost.member.mName }}</strong> {{ modalPost.feed.fContent }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import feedApi from "@/apis/feedApi";
import feedPictureApi from "@/apis/feedPictureApi";
import memberApi from "@/apis/memberApi";
import { formatTimeAgo } from "@/utils/time";

const router = useRouter();

const posts = ref([]);
const loading = ref(false);
const page = ref(1);
const hasMore = ref(true);
const scrollTrigger = ref(null);
let observer = null;
let scrollTimeout = null;

// 모달 관련 (통일)
const showModal = ref(false);
const modalPost = ref(null);        // ← post 통째로 보관 (feed + member + pictures)
const currentImageIndex = ref(0);

// 피드 불러오기
async function loadFeeds(reset = false) {
  if (loading.value || !hasMore.value) return;
  loading.value = true;

  try {
    // 1) 내 회원번호
    const meResponse = await memberApi.selectMemberByMno();
    const myNo = meResponse.data.mNo;

    // 2) 나 제외 피드
    const feedResponse = await feedApi.getFeedListExceptMe(myNo, page.value, reset);
    const feedList = feedResponse.data?.data || [];

    if (!feedList.length) {
      hasMore.value = false;
      return;
    }

    // 3) 각 피드의 작성자 + 사진 병렬 로드
    for (const feed of feedList) {
      const [picResponse, authorResponse] = await Promise.all([
        feedPictureApi.getFeedPictureList(feed.fNo),
        memberApi.selectMemberByMno(feed.fMemberNo), // 필드명 통일: fMemberNo
      ]);

      const pictures = picResponse.data?.data || [];
      const author = authorResponse.data;

      posts.value.push({
        feed,
        pictures,
        member: author,
        currentImageIndex: 0,
        isLiked: false,
      });
    }

    page.value++;
  } catch (e) {
    console.error("피드 로드 실패:", e);
  } finally {
    loading.value = false;
  }
}

// 이미지 변경 (공용: 카드/모달 둘 다)
function changeImage(pictures, post, direction) {
  if (post) {
    if (direction === "next" && post.currentImageIndex < pictures.length - 1)
      post.currentImageIndex++;
    if (direction === "prev" && post.currentImageIndex > 0)
      post.currentImageIndex--;
  } else {
    if (direction === "next" && currentImageIndex.value < pictures.length - 1)
      currentImageIndex.value++;
    if (direction === "prev" && currentImageIndex.value > 0)
      currentImageIndex.value--;
  }
}

// 좋아요 토글
function toggleLike(post) {
  post.isLiked = !post.isLiked;
  if (post.isLiked) post.feed.likes = (post.feed.likes || 0) + 1;
  else post.feed.likes = Math.max((post.feed.likes || 1) - 1, 0);
}

// 무한스크롤
function setupInfiniteScroll() {
  observer = new IntersectionObserver(async (entries) => {
    const entry = entries[0];
    if (entry.isIntersecting && !loading.value && hasMore.value) {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(async () => {
        await loadFeeds();
      }, 500);
    }
  });
  if (scrollTrigger.value) observer.observe(scrollTrigger.value);
}
function cleanupInfiniteScroll() {
  if (observer && scrollTrigger.value) observer.unobserve(scrollTrigger.value);
}

// 모달 열기/닫기 (추가 호출 없음, posts의 데이터만 사용)
function openModal(post) {
  modalPost.value = post;       // 이미 다 들어있음 (feed/member/pictures)
  currentImageIndex.value = post.currentImageIndex || 0;
  showModal.value = true;
  document.body.style.overflow = "hidden";
}
function closeModal() {
  showModal.value = false;
  modalPost.value = null;
  document.body.style.overflow = "auto";
}

// 새로고침
function reloadFeeds() {
  posts.value = [];
  page.value = 1;
  hasMore.value = true;
  loadFeeds(true);
}

// OtherFeed 이동
function goOtherFeed(mNo) {
  router.push(`/otherfeed/${mNo}`);
}

onMounted(async () => {
  await loadFeeds(true); // 처음 진입 시 랜덤 초기화
  await nextTick();
  setupInfiniteScroll();
});
onUnmounted(() => {
  cleanupInfiniteScroll();
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
  padding: 14px 16px 12px 16px;
}

.feed-header {
  display: flex;
  align-items: center;
  padding-left: 4px;
}

.feed-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 8px;
}

.feed-image-wrapper {
  position: relative;
}

.arrow-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 38px;
  height: 38px;
  background: rgba(0, 0, 0, 0.4);
  border: none;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  cursor: pointer;
  transition: 0.2s;
}
.arrow-btn:hover {
  background: rgba(0, 0, 0, 0.6);
}
.arrow-btn.left {
  left: 12px;
}
.arrow-btn.right {
  right: 12px;
}

.dots-indicator {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
}
.dots-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
}
.dots-indicator span.active {
  background: white;
}
.modal-dots span {
  background: rgba(255, 255, 255, 0.5);
}
.modal-dots span.active {
  background: white;
}

.feed-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 2px;
  margin-bottom: 0px;
  padding-left: 6px;
}

.feed-stats {
  margin: 0;
  padding-left: 6px;
}

.feed-actions i {
  cursor: pointer;
  font-size: 1.4rem;
}
.feed-actions i:hover {
  transform: scale(1.08);
  transition: 0.15s;
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
