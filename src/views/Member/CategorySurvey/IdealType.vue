<template>
  <div class="card">
    <h4>Your Ideal Type</h4>
    <p>Select the qualities you’re looking for in a partner</p>

    <div class="selected">
      <span 
        v-for="(quality, idx) in selectedQualities" 
        :key="idx" 
        class="tag selected">
        {{ quality }}
        <button @click="removeQuality(quality)">×</button>
      </span>
    </div>

    <h5 class="mt-3">Available Qualities</h5>
    <div class="tags">
      <span 
        v-for="quality in qualities" 
        :key="quality" 
        class="tag" 
        :class="{ active: selectedQualities.includes(quality) }"
        @click="toggleQuality(quality)">
        {{ quality }}
      </span>
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
