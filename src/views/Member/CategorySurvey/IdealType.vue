<template>
  <div class="card shadow-sm p-4 mb-4">
    <h4 class="mb-3">Your Ideal Type</h4>
    <p class="text-muted">Select the qualities you’re looking for in a partner</p>

    <!-- 선택된 -->
    <div class="mb-3">
      <span 
        v-for="(quality, idx) in selectedQualities" 
        :key="idx" 
        class="badge bg-primary me-2 p-2">
        {{ quality }}
        <button 
          class="btn-close btn-close-white ms-2" 
          @click="removeQuality(quality)">
        </button>
      </span>
    </div>

    <!-- 선택 옵션 -->
    <h6 class="fw-bold mb-2">Available Qualities</h6>
    <div class="d-flex flex-wrap gap-2">
      <button 
        v-for="quality in qualities" 
        :key="quality" 
        class="btn btn-sm"
        :class="selectedQualities.includes(quality) ? 'btn-dark text-white' : 'btn-outline-dark'"
        @click="toggleQuality(quality)">
        {{ quality }}
      </button>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue";

const selectedQualities = ref(["Adventurous", "Creative", "Kind"]);

const qualities = [
  "Adventurous","Artistic","Athletic","Ambitious","Caring","Funny",
  "Intelligent","Kind","Romantic","Thoughtful","Independent"
];

function toggleQuality(q) {
  if (selectedQualities.value.includes(q)) {
    selectedQualities.value = selectedQualities.value.filter(x => x !== q);
  } else {
    selectedQualities.value.push(q);
  }
}

function removeQuality(q) {
  selectedQualities.value = selectedQualities.value.filter(x => x !== q);
}
</script>
