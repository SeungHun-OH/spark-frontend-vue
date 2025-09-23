<template>
  <div class="container py-4">

    <!-- 상단 헤더 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold">My Preferences</h3>
      <button class="btn btn-dark">
        <i class="bi bi-save me-1"></i> Save
      </button>
    </div>

    <!-- 탭 네비게이션 -->
    <ul class="nav nav-pills nav-justified mb-4">
      <li class="nav-item">
        <button 
          class="nav-link"
          :class="{ active: activeTab==='hobbies' }"
          @click="activeTab = 'hobbies'">
          Hobbies
        </button>
      </li>
      <li class="nav-item">
        <button 
          class="nav-link"
          :class="{ active: activeTab==='mbti' }"
          @click="activeTab = 'mbti'">
          MBTI
        </button>
      </li>
      <li class="nav-item">
        <button 
          class="nav-link"
          :class="{ active: activeTab==='ideal' }"
          @click="activeTab = 'ideal'">
          Ideal Type
        </button>
      </li>
    </ul>

    <!-- 카드들 -->
    <div v-if="activeTab==='hobbies'">
      <Hobbies />
    </div>
    <div v-else-if="activeTab==='mbti'">
      <Mbti />
    </div>
    <div v-else>
      <IdealType />
    </div>

    <!-- 저장 버튼 -->
    <div class="d-flex justify-content-between mt-4">
      <button class="btn btn-outline-secondary">Cancel</button>
      <button class="btn btn-dark">Save Preferences</button>
    </div>

     <!-- 오른쪽 네비 버튼 -->
    <div class="d-flex justify-content-end mt-3">
      <button class="btn btn-outline-dark rounded-circle">
        <i class="bi bi-arrow-right"></i>
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import Hobbies from "./Hobbies.vue";
import IdealType from "./IdealType.vue";
import Mbti from "./Mbti.vue";


const activeTab = ref("hobbies");
</script>
