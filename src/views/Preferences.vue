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
            <i class="bi bi-pencil-square text-muted" role="button"></i>
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
            <i class="bi bi-pencil-square text-muted" role="button"></i>
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
import { ref, computed } from 'vue';
import BaseCard from '@/components/member/BaseCard.vue';

const profile = ref({
  bio: 'I love hiking, photography, and cozy coffee shops.',
  mbti: 'ENFP'
});

const preferences = ref({
  Hobbies: ['Photography', 'Hiking', 'Coffee', 'Travel', 'Art', 'Gaming', 'Movies', 'Yoga'],
  Traits: ['Empathetic', 'Curious', 'Spontaneous', 'Funny', 'Kind', 'Creative'],
  Food: ['Sushi', 'Pizza', 'Tteokbokki', 'Ramen', 'Steak', 'Salad'],
  DatePlace: ['Cafe', 'Beach', 'Bookstore', 'Gallery', 'Park', 'Mountain'],
  IdealType: ['Adventurous', 'Creative', 'Empathetic']
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
</script>

<style scoped>
/* 카드와 뱃지 디자인 조금 더 자연스럽게 */
.badge {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
}
</style>
