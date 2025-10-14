<template>
  <div class="banner">
    <div class="banner-left">
      <button class="btn btn-link text-dark me-3 p-0" @click="goBackToFeed">
        <i class="bi bi-arrow-left fs-4"></i>
      </button>
      <div>
        <h2>Preferences</h2>
        <small class="text-muted">interests and style information</small>
      </div>
    </div>
  </div>

  <div class="container py-4">
    <div class="row g-3">
      <!-- 왼쪽 컬럼 -->
      <div class="col-md-6 d-flex flex-column gap-3">
        <BaseCard v-for="(items, category) in leftColumn" :key="category">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="fw-bold mb-0">{{ category }}</h6>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <span
              v-for="(item, index) in items"
              :key="index"
              class="badge bg-light text-dark px-3 py-2 shadow-sm"
              style="border-radius: 8px; font-size: 0.8rem;"
            >
              {{ item }}
            </span>
          </div>
        </BaseCard>
      </div>

      <!-- 오른쪽 컬럼 -->
      <div class="col-md-6 d-flex flex-column gap-3">
        <BaseCard v-for="(items, category) in rightColumn" :key="category">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="fw-bold mb-0">{{ category }}</h6>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <span
              v-for="(item, index) in items"
              :key="index"
              class="badge bg-light text-dark px-3 py-2 shadow-sm"
              style="border-radius: 8px; font-size: 0.8rem;"
            >
              {{ item }}
            </span>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import BaseCard from '@/components/member/BaseCard.vue';
import memberCategoryApi from '@/apis/memberCategoryApi';
import { useRoute } from 'vue-router';
import memberApi from '@/apis/memberApi';
import router from '@/router';
import store from '@/store';

const route = useRoute();

const preferences = ref({
  Hobbies: [],
  Traits: [],
  Food: [],
  DatePlace: [],
  IdealType: []
});

const mnickname = ref();

const leftColumn = computed(() => ({
  Hobbies: preferences.value.Hobbies,
  Traits: preferences.value.Traits,
  Food: preferences.value.Food
}));

const rightColumn = computed(() => ({
  DatePlace: preferences.value.DatePlace,
  IdealType: preferences.value.IdealType
}));

async function getPreferences() {

  mnickname.value = route.params.mNickname;
  const response = await memberCategoryApi.getCategoryByMnickname(mnickname.value);
  const selfPrefers = response.data.data.selfPrefers;
  for (let i = 0; i < selfPrefers.length; i++) {
    if (selfPrefers[i].pcTypeNum === 1) {
      preferences.value.Hobbies.push(selfPrefers[i].pcName);
    } else if (selfPrefers[i].pcTypeNum === 2) {
      preferences.value.Traits.push(selfPrefers[i].pcName);
    } else if (selfPrefers[i].pcTypeNum === 3) {
      preferences.value.IdealType.push(selfPrefers[i].pcName);
    }else if (selfPrefers[i].pcTypeNum === 4) {
      preferences.value.Food.push(selfPrefers[i].pcName);
    }else{
      preferences.value.DatePlace.push(selfPrefers[i].pcName);
    }
  }
}

async function goBackToFeed() {
  if (mnickname.value === store.getters['member/getMNickname']) {
    //본인일 경우 본인 피드로
    router.push(`/feed`);
  } else {
    //아닐 경우 타인의 피드로
    const response = await memberApi.selectMemberByMnickname(mnickname.value);
    router.push(`/otherfeed/${response.data.mNo}`);
  }
}

onMounted(async () => {
  await getPreferences();
});
</script>

<style scoped>
.badge {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
}
</style>
