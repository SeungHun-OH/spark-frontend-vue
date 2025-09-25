<template>
  <div class="card shadow-sm p-4 mb-4">
    <h4 class="mb-3">Your Hobbies</h4>
    <p class="text-muted">Select the hobbies and interests that represent you</p>

    <!-- 선택된 취미 -->
    <div class="mb-3">
      <span v-for="(hobby, idx) in selectedHobbies" :key="idx" class="badge bg-dark text-white me-2 p-2">
        {{ hobby.pc_name }}
        <button class="btn-close btn-close-white ms-2" @click="removeHobby(hobby)">
        </button>
      </span>
    </div>

    <!-- 커스텀 취미 -->
    <div class="input-group mb-3">
      <input v-model="customHobby" placeholder="Enter a custom hobby..." class="form-control" @keyup.enter="addCustomHobby" />
      <button class="btn btn-outline-dark" @click="addCustomHobby">+</button>
    </div>

    <!-- 인기 취미 -->
    <h6 class="fw-bold mb-2">Popular Hobbies</h6>
    <div class="d-flex flex-wrap gap-2">
      <button v-for="hobby in popularHobbies" :key="hobby" class="btn btn-sm" :class="selectedHobbies.includes(hobby) ? 'btn-dark text-white' : 'btn-outline-dark'"
        @click="toggleHobby(hobby)"> 방가요
        {{ hobby.pc_name }} {{ hobby.pc_no }}
      </button>
    </div>

    <div>
      <button class = "btn btn-info-primary mt-3" @click="saveSelectdeHobbies"> 저장 </button>
    </div>
  </div>
</template>


<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";

const selectedHobbies = ref([]);
const customHobby = ref("");

const store = useStore();

// const popularHobbies = computed(() => {
//   return store.getters["memberCategory/getCategoriesByType"]("HOBBY").map(c => c.pc_name);
// });

const popularHobbies = computed(() => {
  return store.getters["memberCategory/getCategoriesByType"]("HOBBY");
});

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

function saveSelectdeHobbies(){

  store.commit("memberCategory/addSelectCategories", selectedHobbies.value.map(hobby => hobby.pc_no));
}
</script>
