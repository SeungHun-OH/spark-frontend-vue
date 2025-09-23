<template>
  <div class="card">
    <h4>Your MBTI Type</h4>
    <p>Select your Myers-Briggs personality type</p>

    <div class="mbti-grid">
      <button 
        v-for="type in mbtiTypes" 
        :key="type" 
        :class="['mbti-btn', { active: selectedMbti === type }]" 
        @click="selectedMbti = type">
        {{ type }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const mbtiTypes = [
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP"
];

const selectedMbti = ref("ENFP");
</script>
