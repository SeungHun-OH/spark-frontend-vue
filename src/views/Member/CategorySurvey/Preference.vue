<template>
  <div class="container py-4">

    <!-- 탭 -->
    <ul class="nav nav-pills mb-4">
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
      <Hobbies/>
    </div>

    <div v-else-if="activeTab==='mbti'">
      <Mbti/>
    </div>

    <div v-else>
      <IdealType/>
    </div>

    <!-- 저장 버튼 -->
    <div class="d-flex justify-content-between mt-4">
      <button class="btn btn-outline-secondary">Cancel</button>
      <button class="btn btn-dark">Save Preferences</button>
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
