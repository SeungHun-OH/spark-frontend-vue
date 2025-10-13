<template>
  <div>
    <h3 class="mb-3">Feed</h3>

    <!-- Profile header -->
    <div class="card mb-3" style="border-radius:12px; padding:22px; display:flex; gap:18px; align-items:center;">
      <img :src="`http://localhost:8040/member/memberPicture/${profile.mnickname}`" width="96" height="96"
        style="border-radius:50%;" />

      <div style="flex:1;">
        <div class="d-flex align-items-center justify-content-between">
          <!-- 이름 + 하트 같은 줄 -->
          <div class="d-flex align-items-center gap-2 mb-0">
            <h4 class="mt-1 mb-0">{{ profile.mname }}</h4>
            <i :class="isLiked ? 'bi bi-heart-fill text-danger fs-5' : 'bi bi-heart fs-5'" style="cursor:pointer;"
              @click="feedLike"></i>
          </div>
        </div>

        <small class="text-muted mt-1 d-block">
          {{ feedNoList.length }} posts · 156 followers · 89 following
        </small>
        <p class="mt-1 text-muted" style="font-size: 15px;">{{ profile.mbio }}</p>


        <!-- 취미 태그 + 플러스 버튼 -->
        <div class="d-flex flex-wrap gap-2 align-items-center">
          <div v-for="(h, i) in profile.mhobby" :key="i">
            <span class="badge bg-light text-dark">{{ h }}</span>
          </div>
          <button class="btn btn-sm btn-outline-secondary" @click="goPreferences">+</button>
        </div>
      </div>
    </div>

    <!-- My Posts title -->
    <div class="d-flex align-items-center justify-content-between mb-3">
      <div class="d-flex align-items-center">
        <i class="bi bi-grid-3x3-gap-fill me-2"></i>
        <h5 class="mb-0">My Feed</h5>
      </div>
    </div>

    <!-- grid -->
    <div class="my-post-grid">
      <div class="post-item position-relative" v-for="p in feedNoList" :key="p.fNo" @click="openPost(p.fNo)">
        <img :src="`http://localhost:8040/feedPicture/picture/${p.fpNo}`" />
      </div>
    </div>

    <!-- 로딩 상태 표시 -->
    <div v-if="isLoading" class="text-center mt-3 text-muted">Loading more posts...</div>
    <div v-if="isEnd" class="text-center mt-3 text-muted">No more posts</div>

    <!-- Modal -->
    <div class="modal fade" tabindex="-1" :class="{ show: showModal }" style="display:block" v-if="showModal">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content" style="border-radius:12px;">
          <div class="modal-body p-0 d-flex">
            <!-- 왼쪽: 이미지 -->
            <div style="flex:1; position:relative;">
              <img v-if="modalPostPictures && modalPostPictures.length > 0"
                :src="`http://localhost:8040/feedPicture/picture/${modalPostPictures[currentImageIndex].fpNo}`"
                style="width:100%; height:80vh; object-fit:cover;" />

              <!-- 좌우 화살표 버튼 -->
              <button v-if="currentImageIndex > 0" class="arrow-btn left" @click="changeImage('prev')">
                <i class="bi bi-chevron-left"></i>
              </button>
              <button v-if="currentImageIndex < modalPostPictures.length - 1" class="arrow-btn right"
                @click="changeImage('next')">
                <i class="bi bi-chevron-right"></i>
              </button>

              <!-- 점 인디케이터 -->
              <div class="dots-indicator modal-dots">
                <span v-for="(pic, idx) in modalPostPictures" :key="idx"
                  :class="{ active: idx === currentImageIndex }"></span>
              </div>
            </div>

            <!-- 오른쪽: 게시글 -->
            <div style="width:420px; background:#fff; padding:20px;">
              <div class="d-flex align-items-center mb-3">
                <img :src="`http://localhost:8040/member/memberPicture/${modalAuthor.mNickname}`"
                  class="rounded-circle me-2" width="48" height="48" />
                <div>
                  <div class="fw-bold">{{ modalAuthor.mName }}</div>
                  <small class="text-muted">{{ formatTimeAgo(modalPost.feed.fDate) }}</small>
                </div>
                <button class="btn-close ms-2" @click="closeModal()"></button>
              </div>

              <div class="feed-actions mb-1 d-flex align-items-center">
                <i :class="isLiked ? 'bi bi-heart-fill text-danger fs-4 me-3' : 'bi bi-heart fs-4 me-3'"
                  style="cursor:pointer;" @click="toggleLike"></i>
                <i class="bi bi-chat fs-4" style="cursor:pointer;"></i>
              </div>
              <div class="mb-2">
                <div class="mb-2"><strong>{{ modalLikes }}</strong> likes</div>
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
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import memberApi from '@/apis/memberApi';
import feedApi from '@/apis/feedApi';
import feedPictureApi from '@/apis/feedPictureApi';
import memberCategoryApi from '@/apis/memberCategoryApi';
import { formatTimeAgo } from '@/utils/time';
import heartsApi from '@/apis/heartsApi';

const router = useRouter();
const route = useRoute();

const profile = ref({
  mno: "",
  mname: "",
  mnickname: "",
  mbio: "",
  mhobby: [],
});

// 피드
const feedNoList = ref([]);
const showModal = ref(false);

// 모달
const modalPost = ref({});
const modalPostPictures = ref([]);
const modalAuthor = ref({});
const currentImageIndex = ref(0);

const isModalLiked = ref(false);
const isFeedLiked = ref(false);
const modalLikes = ref(45);

// 무한 스크롤 관련 상태
const currentPage = ref(1);
const isLoading = ref(false);
const isEnd = ref(false);

// 이동 함수들
function goPreferences() {
  router.push(`/preferences/${profile.value.mnickname}`);
}

// 스크롤 이벤트 핸들러
function handleScroll() {
  const scrollPosition = window.innerHeight + window.scrollY;
  const bottom = document.body.offsetHeight - 300;
  if (scrollPosition >= bottom && !isLoading.value && !isEnd.value) {
    currentPage.value++;
    getPosts();
  }
}

// 프로필 + 취미
async function getProfile() {
  try {
    const response = await memberApi.selectMemberByMno(route.params.mNo);
    profile.value.mno = response.data.mNo;
    profile.value.mname = response.data.mName;
    profile.value.mnickname = response.data.mNickname;
    profile.value.mbio = response.data.mBio;

    const categoryResponse = await memberCategoryApi.getHobbyCategoriesByMemberNo(profile.value.mno);
    for (let i = 0; i < categoryResponse.data.data.length; i++) {
      profile.value.mhobby.push(categoryResponse.data.data[i].pcName);
    }
  } catch (error) {
    console.log(error);
  }
}

// 피드 (페이징 적용)
async function getPosts(reset = false) {
  if (reset) {
    currentPage.value = 1;
    feedNoList.value = [];
    isEnd.value = false;
  }
  isLoading.value = true;
  try {
    const response = await feedPictureApi.getFirstImageofFeed(profile.value.mno, currentPage.value);
    const firstImg = response.data.data;

    if (!firstImg || firstImg.length === 0) {
      isEnd.value = true;
      return;
    }

    for (let i = 0; i < firstImg.length; i++) {
      feedNoList.value.push({
        fNo: firstImg[i].fpFeedNo,
        fpNo: firstImg[i].fpNo,
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}

// 모달 열기
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

// 이미지 이동
function changeImage(direction) {
  if (direction === "next" && currentImageIndex.value < modalPostPictures.value.length - 1)
    currentImageIndex.value++;
  if (direction === "prev" && currentImageIndex.value > 0)
    currentImageIndex.value--;
}

//피드 라이크
async function feedLike() {
  isFeedLiked.value = !isFeedLiked.value;
  try {
    console.log(profile.value);
    //모두 uuid로 변경
    // await heartsApi.sendHeart(profile.value.muuid || route.params.mUuid, 'F');
    await heartsApi.sendHeart(profile.value.mno, 'F');
    console.log("하트 전송 성공");
  }catch (error) {
    console.log("하트 전송 실패 : ", error);
  }
}

// 좋아요 토글
function toggleLike() {
  isModalLiked.value = !isModalLiked.value;
  modalLikes.value += isModalLiked.value ? 1 : -1;
}

function closeModal() {
  showModal.value = false;
  document.body.style.overflow = 'auto';
}

onMounted(async () => {
  await getProfile();
  await getPosts();
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
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

.feed-actions {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 2px;
  margin-bottom: 0px;
  padding-left: 0px;
}

.feed-actions i:hover {
  transform: scale(1.1);
  transition: 0.15s;
}
</style>
