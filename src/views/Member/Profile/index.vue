<template>
  <div class="container py-4">
    <h4 class="mb-1">My Profile</h4>
    <p class="text-muted">Manage your dating profile</p>

    <div class="row">
      <!-- 왼쪽 메인 영역 -->
      <div class="col-md-8">

        <!-- 사진 카드 -->
        <BaseCard>
          <div class="text-center">
            <img
              :src="picture"
              alt="profile"
              class="rounded img-fluid mb-2"
              style="max-height: 250px; object-fit: cover;"
            />
            <button class="btn btn-outline-secondary btn-sm">
              <i class="bi bi-camera"></i> Add Photo
            </button>
          </div>
        </BaseCard>

        <!-- 기본 정보 -->
        <BaseCard>
          <div class="d-flex justify-content-between">
            <h6 class="fw-bold">Basic Info</h6>
            <i class="bi bi-pencil-square cursor-pointer"></i>
          </div>
          <p class="mb-0 fw-bold"> {{ store.getters["member/getM_name"] }} {{ store.getters["member/getM_age"] }}</p>
          <p class="text-muted mb-1"><i class="bi bi-geo-alt"></i> {{ store.getters["member/getM_region"] }}</p>

          <p class="text-muted mb-1"><i class="bi bi-briefcase"></i> {{ profile.job }}</p>
          <p class="text-muted"><i class="bi bi-mortarboard"></i> {{ profile.education }}</p>
        </BaseCard>

        <!-- 자기소개 -->
        <BaseCard>
          <div class="d-flex justify-content-between">
            <h6 class="fw-bold">About Me</h6>
            <i class="bi bi-pencil-square cursor-pointer"></i>
          </div>
          <p class="text-muted mb-0">{{ store.getters["member/getM_bio"] }}</p>
        </BaseCard>

      </div>

      <!-- 오른쪽 사이드 -->
      <div class="col-md-4">

        <!-- 관심사 -->
        <BaseCard>
          <div class="d-flex justify-content-between">
            <h6 class="fw-bold">Interests</h6>
            <i class="bi bi-pencil-square cursor-pointer"></i>
          </div>
          <div>
            <span
              v-for="(hobby, index) in profile.interests"
              :key="index"
              class="badge bg-light text-dark me-1 mb-1"
            >
              {{ hobby }}
            </span>
          </div>
        </BaseCard>

        <!-- 선호조건 -->
        <BaseCard>
          <div class="d-flex justify-content-between">
            <h6 class="fw-bold">Dating Preferences</h6>
            <i class="bi bi-pencil-square cursor-pointer"></i>
          </div>
          <p class="mb-1">Age Range: {{ profile.preferences.ageRange }}</p>
          <p class="mb-1">Maximum Distance: {{ profile.preferences.distance }}</p>
          <p class="mb-0">Looking For: <span class="fw-bold">{{ profile.preferences.lookingFor }}</span></p>
        </BaseCard>

        <!-- 계정 설정 -->
        <BaseCard>
          <h6 class="fw-bold">Account Settings</h6>
          <button class="btn btn-light w-100 mb-2 text-start">
            <i class="bi bi-shield-lock"></i> Privacy Settings
          </button>
          <button class="btn btn-light w-100 mb-2 text-start">
            <i class="bi bi-bell"></i> Notification Preferences
          </button>
          <button class="btn btn-outline-danger w-100 text-start">
            <i class="bi bi-trash"></i> Delete Account
          </button>
        </BaseCard>

      </div>
    </div>
  </div>
</template>

<script setup>

import BaseCard from '@/components/member/BaseCard.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const picture = computed(() => {
  const data = store.getters["member/getM_attachdata"];
  return data ? `data:image/png;base64,${data}` : null;
});

const profile = {
  photo: "https://via.placeholder.com/400x300",
  name: "Alex Johnson",
  age: 29,
  location: "San Francisco, CA",
  job: "Senior Software Engineer at TechCorp",
  education: "Computer Science, Stanford University",
  about: "Software engineer who loves cooking, traveling, and meeting new people. Always up for trying new restaurants or exploring hidden gems in the city!",
  interests: ["Cooking", "Travel", "Photography", "Hiking", "Wine Tasting", "Rock Climbing"],
  preferences: {
    ageRange: "25 - 35",
    distance: "25 km",
    lookingFor: "Long-term relationship"
  }
}
</script>
