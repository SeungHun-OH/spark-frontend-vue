<template>
  <div class="card shadow-sm p-4 mb-4">
    <h4 class="mb-3">Your MBTI Type</h4>
    <p class="text-muted">Select your Myers-Briggs personality type</p>

    <div class="row g-2">
      <div 
        v-for="type in mbtiTypes" 
        :key="type" 
        class="col-3 d-grid">
        <button 
          class="btn"
          :class="selectedMbti === type ? 'btn-dark text-white' : 'btn-outline-dark'"
          @click="selectedMbti = type">
          {{ type }}
        </button>
      </div>
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
