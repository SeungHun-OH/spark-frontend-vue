<template>
  <div class="card">
    <h4>Your Hobbies</h4>
    <div class="selected">
      <span 
        v-for="(hobby, idx) in selectedHobbies" 
        :key="idx" 
        class="tag selected">
        {{ hobby }}
        <button @click="removeHobby(hobby)">×</button>
      </span>
    </div>

    <input 
      v-model="customHobby" 
      placeholder="Enter a custom hobby..." 
      @keyup.enter="addCustomHobby"
    />
    <button @click="addCustomHobby">+</button>

    <h5 class="mt-3">Popular Hobbies</h5>
    <div class="tags">
      <span 
        v-for="hobby in popularHobbies" 
        :key="hobby" 
        class="tag" 
        :class="{ active: selectedHobbies.includes(hobby) }"
        @click="toggleHobby(hobby)">
        {{ hobby }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const selectedHobbies = ref(["Photography", "Hiking", "Coffee"]);
const customHobby = ref("");

const popularHobbies = [
  "Photography", "Hiking", "Coffee", "Travel", "Music", "Reading", "Cooking"
];

function toggleHobby(hobby) {
  if (selectedHobbies.value.includes(hobby)) {
    selectedHobbies.value = selectedHobbies.value.filter(h => h !== hobby);
  } else {
    selectedHobbies.value.push(hobby);
  }
}

function addCustomHobby() {
  if (customHobby.value && !selectedHobbies.value.includes(customHobby.value)) {
    selectedHobbies.value.push(customHobby.value);
    customHobby.value = "";
  }
}

function removeHobby(hobby) {
  selectedHobbies.value = selectedHobbies.value.filter(h => h !== hobby);
}
</script>
