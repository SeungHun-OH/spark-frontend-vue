<template>
  <div class="banner">
    <div class="banner-left">
      <div>
        <h2>Matching</h2>
        <small class="text-muted">Manage your posts and profile</small>
      </div>
    </div>
  </div>
  <div class="match-container">
    <!-- 카드 -->    
    <div
      v-if="currentProfile"
      class="profile-card"
      :style="cardStyle"
      @pointerdown.capture="onPointerDown"
      @pointermove.capture="onPointerMove"
      @pointerup.capture="onPointerUp"
      @pointercancel.capture="onPointerCancel"
      @pointerleave.capture="onPointerCancel"
    >
      <!-- 상단 이미지 -->
      <div class="profile-img-wrap">
        <img
          v-show="!isImageLoading"
          :src="`http://localhost:8040` + currentProfile.url"
          alt="profile"
          class="profile-img"
          @load="onImageLoad"
          @error="onImageError"
          @dragstart.prevent
        />

        <!-- 이미지 로딩 중일 때 로딩 스피너 -->
        <div v-if="isImageLoading" class="img-loading-overlay">
          <div class="spinner-border text-light" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>

      <!-- 하단 정보 -->
      <div class="profile-info">
        <h2>{{ currentProfile.name }}, {{ currentProfile.age ?? "?" }}</h2>
        <p class="sub-info">{{ currentProfile.region }}</p>
        <p class="bio">{{ currentProfile.bio }}</p>
        <div class="tags">
          <span
            v-for="tag in (currentProfile.tags || defaultTags)"
            :key="tag"
            class="tag"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- 버튼 -->
    <div v-if="totalProfiles > 0" class="actions">
      <button class="btn btn-circle btn-x" @click="animateDislike"><span class="icon-x">✕</span></button>
      <button class="btn btn-circle btn-refresh" @click="restore"><span class="icon-refresh">⟳</span></button>
      <button class="btn btn-circle btn-heart" @click="animateLike"><span class="icon-heart">♥</span></button>
    </div>

    <!-- 프로그레스바 -->
    <div v-if="totalProfiles > 0" class="progress-wrap">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <span class="progress-text">Profile {{ progressIndex }} of {{ totalProfiles }}</span>
    </div>

    <!-- 카드 없음 -->
    <div v-else class="no-more">더 이상 매칭할 수 있는 사람이 없습니다.</div>
  </div>
</template>

<script setup>
import matchingApi from "@/apis/matchingApi";
import { ref, computed, onMounted, watch } from "vue";

const profiles = ref([]);
const currentIndex = ref(0);
const removedStack = ref([]);
const likedList = ref([]);
const defaultTags = ["hiking", "coffee", "photography", "travel"];
const isImageLoading = ref(true);
const initialProfileCount = ref(0); // 처음 총 개수 저장

const currentProfile = computed(() => profiles.value[currentIndex.value]);
const totalProfiles = computed(() => profiles.value.length);

// 프로그레스바 - 1부터 시작하게 인덱스 조정
const progressIndex = computed(() => {
  return initialProfileCount.value === 0 ? 0 : initialProfileCount.value - profiles.value.length + 1;
});

// 고정된 전체 개수로 나눔
const progressPercent = computed(() => {
  if (initialProfileCount.value === 0) return 0;
  return (progressIndex.value / initialProfileCount.value) * 100;
});

// 카드 스타일
const dragX = ref(0);
const isDragging = ref(false);
const threshold = 35;
const opacity = ref(1);

const cardStyle = computed(() => ({
  transform: `translateX(${dragX.value}px)`,
  opacity: opacity.value,
  transition: isDragging.value ? "none" : "transform 0.3s ease, opacity 0.3s ease",
  background: "#fff",
}));

function dislike() {
  if (!currentProfile.value) return;
  removedStack.value.push({ profile: currentProfile.value, index: currentIndex.value });
  profiles.value.splice(currentIndex.value, 1);

  if (currentIndex.value >= profiles.value.length) {
    currentIndex.value = profiles.value.length - 1;
  }

  resetDrag();
}

async function like() {
  if (!currentProfile.value) return;

  try {
    await matchingApi.postLike(currentProfile.value.uuid);
    likedList.value.push(currentProfile.value);
    profiles.value.splice(currentIndex.value, 1);

    if (currentIndex.value >= profiles.value.length) {
      currentIndex.value = profiles.value.length - 1;
    }

    resetDrag();
  } catch (error) {
    console.error("좋아요 처리 실패:", error);
  }
}

function restore() {
  const last = removedStack.value.pop();
  if (!last) return;

  profiles.value.splice(last.index, 0, last.profile);
  currentIndex.value = last.index;
}

// 애니메이션
function animateLike() {
  dragX.value = 200;
  opacity.value = 0;
  setTimeout(() => like(), 200);
}

function animateDislike() {
  dragX.value = -200;
  opacity.value = 0;
  setTimeout(() => dislike(), 200);
}

// 스와이프 이벤트
let startX = 0;
function onPointerDown(e) {
  isDragging.value = true;
  startX = e.clientX;
}
function onPointerMove(e) {
  if (!isDragging.value) return;
  dragX.value = e.clientX - startX;
  opacity.value = 1 - Math.min(Math.abs(dragX.value) / 200, 0.5);
}
function onPointerUp() {
  if (!isDragging.value) return;
  isDragging.value = false;

  if (dragX.value > threshold) {
    animateLike();
  } else if (dragX.value < -threshold) {
    animateDislike();
  } else {
    resetDrag();
  }
}
function onPointerCancel() {
  isDragging.value = false;
  resetDrag();
}
function resetDrag() {
  dragX.value = 0;
  opacity.value = 1;
}

// 이미지 로딩 이벤트
function onImageLoad() {
  isImageLoading.value = false;
}
function onImageError() {
  isImageLoading.value = false;
  console.error("이미지 로딩 실패");
}

watch(currentProfile, () => {
  isImageLoading.value = true;
});

async function fetchData() {
  try {
    const response = await matchingApi.getMatching();
    profiles.value = response.data.data.map((item) => ({
      name: item.name,
      age: item.age,
      region: item.region,
      bio: item.bio ?? "자기소개가 없습니다.",
      uuid: item.uuid,
      url: item.url,
      tags: item.tags ?? defaultTags,
    }));



    // 여기에서 전체 개수 저장!
    initialProfileCount.value = profiles.value.length;
  } catch (err) {
    console.error("매칭 데이터 불러오기 실패", err);
  }
}

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.match-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  min-height: 100vh;
}

/* 카드 */
.profile-card,
.profile-img-wrap,
.profile-info {
  touch-action: none;
}

.profile-card {
  width: 350px; /* 카드 너비 줄이기 */
  border-radius: 15px; /* 카드 모서리 반경 조정 */
  overflow: hidden;
  position: relative;
  box-shadow: 0 18px 38px rgba(0, 0, 0, 0.15); /* 그림자 크기 줄이기 */
  display: flex;
  flex-direction: column;
}

.profile-img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5; /* 이미지 비율 줄이기 */
  overflow: hidden;
  border-top-left-radius: 15px; /* 이미지 모서리 반경 조정 */
  border-top-right-radius: 15px;
  background: #000;
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 이미지 로딩 오버레이 */
.img-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.profile-info {
  flex: 1;
  background: #fff;
  padding: 12px 16px; /* 패딩 줄이기 */
  color: #333;
}

.profile-info h2 {
  margin: 0;
  font-size: 18px; /* 제목 크기 줄이기 */
  font-weight: 700;
}

.sub-info {
  font-size: 12px; /* 하위 정보 크기 줄이기 */
  color: #666;
}

.bio {
  margin-top: 8px;
  font-size: 14px; /* 자기소개 글씨 크기 줄이기 */
  line-height: 1.4;
}

.tags {
  margin-top: 8px;
}

.tag {
  display: inline-block;
  background: #f1f1f1;
  padding: 4px 8px; /* 태그 크기 줄이기 */
  border-radius: 14px;
  margin-right: 6px;
  font-size: 10px; /* 태그 글씨 크기 줄이기 */
  color: #333;
}

/* 버튼 */
.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px; /* 버튼 간격 줄이기 */
  margin-top: 12px;
  margin-bottom: 20px; /* 버튼 상하 간격 줄이기 */
}

.btn-circle {
  border: none;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-x,
.btn-heart {
  width: 60px; /* 버튼 크기 줄이기 */
  height: 60px;
  font-size: 24px; /* 버튼 글씨 크기 줄이기 */
}

.btn-refresh {
  width: 50px; /* 버튼 크기 줄이기 */
  height: 50px;
  font-size: 20px; /* 버튼 글씨 크기 줄이기 */
}

.icon-x {
  color: #ff3b30;
}

.icon-refresh {
  color: #007aff;
}

.btn-heart {
  background: #ff4d4f;
  color: #fff;
}

/* 프로그레스바 */
.progress-wrap {
  width: 350px; /* 프로그레스바 크기 줄이기 */
  margin-top: 10px;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 6px; /* 프로그레스바 높이 줄이기 */
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 6px;
}

.progress-fill {
  height: 100%;
  background: #ff4d4f;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px; /* 프로그레스바 텍스트 크기 줄이기 */
  color: #6b7280;
}

.no-more {
  margin-top: 40px;
  font-size: 16px;
  font-weight: 600;
  color: #444;
  text-align: center;
}
</style>
