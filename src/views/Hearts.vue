<template>
  <div class="container py-5">
    <!-- 헤더 -->
    <!-- <div class="hidden md:block p-4 xl:p-6 border-b">
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart w-6 h-6 xl:w-7 xl:h-7 text-red-500" aria-hidden="true">
          <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
        </svg>
        <h1 class="text-xl xl:text-2xl">Hearts</h1>
      </div>
      <p class="text-muted-foreground">People who liked you</p>
    </div> -->

    <!-- 탭 -->
    <div class="custom-tab-container mb-4">
      <div class="custom-tab-inner">
        <button class="custom-tab-button" :class="{ active: activeTab === 'M' }" @click="activeTab = 'M'">
          <i class="bi bi-people me-1"></i>
          매칭 좋아요
          <span class="count-badge"> {{ matchingLikes.length }}</span>
        </button>
        <button class="custom-tab-button" :class="{ active: activeTab === 'F' }" @click="activeTab = 'F'">
          <i class="bi bi-pencil-square me-1"></i>
          피드 좋아요
          <span class="count-badge"> {{ feedLikes.length }}</span>
        </button>
      </div>
    </div>

    <!-- 없을 때 -->
    <div v-if="filteredLikes.length === 0" class="text-center text-muted py-5">
      <i class="bi bi-emoji-frown fs-1 mb-3 d-block"></i>
      아직 받은 신청이 없습니다.
    </div>

    <!-- 카드 목록 -->
    <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
      <div v-for="req in filteredLikes" :key="req.no" class="col d-flex justify-content-center">
        <!-- 카드 -->
        <div class="card shadow-sm border-0 rounded-4 overflow-hidden position-relative like-card">

          <!-- 이미지 영역 -->
          <div class="position-relative img-area">
            <img
              v-if="req.mpNo"
              :src="`/matching/file/${req.uuid}`"
              class="w-100 h-100"
              alt="profile"
              style="object-fit: cover;"
            />
            <div
              v-else
              class="no-image text-muted"
            >
              No Image
            </div>

            <!-- Mutual 뱃지 -->
            <span v-if="req.mutual" class="badge mutual-badge position-absolute top-0 start-0 m-2">
              <i class="bi bi-stars me-1"></i> Mutual
            </span>

            <!-- 액션 버튼 -->
            <div class="card-actions">
              <button class="btn btn-circle btn-reject" @click="reject(req.no)">
                <span class="icon-x">✕</span>
              </button>
              <button class="btn btn-circle btn-accept" @click="accept(req.no)">
                <span class="icon-heart">♥</span>
              </button>
            </div>

            <!-- 오버레이 -->
            <div class="card-overlay"></div>
          </div>

          <!-- 본문 -->
          <div class="card-body d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-1 fw-semibold">{{ req.name }}</h5>
            <span class="age">{{ req.age }}</span>
          </div>

          <div class="px-3 pb-3">
            <p class="card-text text-muted small mb-2">
              {{ timeAgo(req.requestDate) }} ·
              <span class="badge channel-badge">
                {{ getChannelText(req.reqeustChannel) }}
              </span>
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import heartsApi from '@/apis/heartsApi'

const requests = ref([])
const activeTab = ref('M')

const filteredLikes = computed(() =>
  requests.value.filter(req => req.reqeustChannel === activeTab.value)
)

const matchingLikes = computed(() =>
  requests.value.filter(req => req.reqeustChannel === 'M')
)

const feedLikes = computed(() =>
  requests.value.filter(req => req.reqeustChannel === 'F')
)

function getChannelText(code) {
  return code === 'M' ? '매칭' : '피드'
}

function timeAgo(dateStr) {
  const now = new Date()
  const past = new Date(dateStr)
  const diff = Math.floor((now - past) / 60000)
  if (diff < 1) return '방금 전'
  if (diff < 60) return `${diff}분 전`
  if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`
  return `${Math.floor(diff / 1440)}일 전`
}

async function fetchRequests() {
  try {
    const res = await heartsApi.getHearts()
    requests.value = res.data.data.map(item => ({
      ...item,
      mutual: item.mutual || false
    }))
  } catch (e) {
    console.error('데이터 불러오기 실패', e)
  }
}

async function accept(no) {
  try {
    await heartsApi.acceptHeart(no)
    requests.value = requests.value.filter(r => r.no !== no)
  } catch (e) {
    console.error('수락 실패', e)
  }
}

async function reject(no) {
  try {
    await heartsApi.rejectHeartReqeust(no)
    requests.value = requests.value.filter(r => r.no !== no)
  } catch (e) {
    console.error('거절 실패', e)
  }
}

onMounted(() => {
  fetchRequests()
})
</script>

<style scoped>
/* 탭 */
.custom-tab-container {
  display: flex;
  justify-content: center;
}
.custom-tab-inner {
  background-color: #f0f2f5;
  border-radius: 12px;
  display: flex;
  overflow: hidden;
  width: 100%;
}
.custom-tab-button {
  flex: 1;
  border: none;
  background: #ececf0; /* 버튼 배경색을 하얀색으로 설정 */
  padding: 12px 0;
  font-size: 15px;
  font-weight: 500;
  color: #333; /* 글자를 검정색으로 설정 */
  text-align: center;
  cursor: pointer;
  transition: 0.2s ease;
}
.custom-tab-button.active {
  background-color: #ff4d4f; /* 활성화된 버튼의 배경색을 빨강색으로 설정 */
  color: white;
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
.count-badge {
  color: #333;
  font-size: 14px;
  font-weight: 500;
  margin-left: 6px;
}

/* 카드 */
.like-card {
  width: 250px; /* 카드 크기 조정 */
  transition: all 0.3s ease;
  margin: 0 auto;
  position: relative;
}
.like-card:hover {
  transform: translateY(-4px);
}
.img-area {
  height: 200px;
  min-height: 200px;
  position: relative;
}
.no-image {
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 오버레이 */
.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  transition: background 0.3s ease;
  z-index: 1;
}
.like-card:hover .card-overlay {
  background: rgba(0, 0, 0, 0.35);
}

/* 액션 버튼 */
.card-actions {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 16px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease;
  z-index: 2;
}
.like-card:hover .card-actions {
  opacity: 1;
  pointer-events: auto;
  transform: translate(-50%, -50%) scale(1.05);
}
.btn-circle {
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  font-size: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
  background-color: transparent;
}

.btn-reject:hover {
  background-color: #ffffff;
  color: #ff4d4f;
}

.btn-accept:hover {
  background-color: #ff4d4f;
  color: #ffffff;
}

.btn-reject {
  background-color: #ffffff;
  color: #ff4d4f;
}
.btn-accept {
  background-color: #ff4d4f;
  color: #ffffff;
}
.icon-x,
.icon-heart {
  font-weight: 700;
}

/* 본문 */
.card-body {
  padding: 12px 16px;
}
.card-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}
.age {
  font-size: 0.9rem;
  font-weight: 400;
  color: #666;
}

/* 뱃지 */
.mutual-badge {
  background-color: #ff4d4f;
  color: white;
  font-size: 0.8rem;
  padding: 6px 10px;
  border-radius: 20px;
  z-index: 3;
}
.channel-badge {
  background-color: #eef0f3;
  color: #333;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 20px;
}

/* 반응형 */
@media (max-width: 576px) {
  .like-card {
    width: 100%;
  }
  .card-actions {
    gap: 12px;
  }
  .btn-circle {
    width: 52px;
    height: 52px;
    font-size: 22px;
  }
}
</style>
