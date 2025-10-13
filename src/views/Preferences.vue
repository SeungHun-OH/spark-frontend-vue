<template>
  <div class="container py-4">
    <!-- 상단 헤더 -->
    <h3 class="fw-bold mb-2">My Preferences</h3>
    <p class="text-muted mb-4">Customize your dating profile</p>

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
              style="border-radius: 8px; font-size: 0.9rem;"
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
              style="border-radius: 8px; font-size: 0.9rem;"
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

const route = useRoute();

const preferences = ref({
  Hobbies: [],
  Traits: [],
  Food: [],
  DatePlace: [],
  IdealType: []
});

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

  const mnickname = route.params.mNickname;
  const response = await memberCategoryApi.getCategoryByMnickname(mnickname);
  const selfPrefers = response.data.data.selfPrefers;
  console.log(selfPrefers);
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
