<template>
  <div class="card shadow-sm p-4 mb-4">
    <h4 class="mb-3">{{ titleText }}</h4>
    <p class="text-muted">{{ descriptionText }}</p>

    <!-- 선택된 항목 -->
    <div class="mb-3">
      <span v-for="(item, idx) in selectedItems" :key="idx" class="badge bg-dark text-white me-2 p-2">
        {{ item.pc_name }}
        <button class="btn-close btn-close-white ms-2" @click="removeItem(item)"></button>
      </span>
    </div>

    <!-- 커스텀 입력 -->
    <div class="input-group mb-3">
      <input v-model="customInput" :placeholder="`Enter a custom ${props.type.toLowerCase()}...`" class="form-control" @keyup.enter="addCustom" />
      <button class="btn btn-outline-dark" @click="addCustom">+</button>
    </div>

    <!-- 인기 항목 -->
    <h6 class="fw-bold mb-2">Popular {{ props.type }}</h6>
    <div class="d-flex flex-wrap gap-2">
      <button v-for="item in options" :key="item.pc_no" class="btn btn-sm" :class="selectedItems.includes(item) ? 'btn-dark text-white' : 'btn-outline-dark'" @click="toggleItem(item)">
        {{ item.pc_name }}
      </button>
    </div>

    <!-- 저장 버튼 -->
    <div>
      <button class="btn btn-info-primary mt-3" @click="saveSelected">저장</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  type: String // "HOBBY", "MBTI", "IDEALTYPE" ...
});

const store = useStore();
const selectedItems = ref([]);
const customInput = ref("");

// Vuex에서 type에 맞는 항목 가져오기
const options = computed(() => {
  return store.getters["memberCategory/getCategoriesByType"](props.type);
});

// UI 타이틀, 설명은 타입별로 자동 설정
const titleText = computed(() => {
  switch (props.type) {
    case "HOBBY": return "Your Hobbies";
    case "MBTI": return "Your MBTI";
    case "IDEALTYPE": return "Your Ideal Type";
    case "TRAIT": return "Your Traits";
    case "FOOD": return "Your Favorite Foods";
    default: return "Your Preferences";
  }
});
const descriptionText = computed(() => {
  switch (props.type) {
    case "HOBBY": return "Select the hobbies and interests that represent you";
    case "MBTI": return "Select your MBTI type";
    case "IDEALTYPE": return "Select the qualities you want in a partner";
    case "TRAIT": return "Choose traits that best describe you";
    case "FOOD": return "Select foods you like";
    default: return "Select your preferences";
  }
});

// 토글 선택
function toggleItem(item) {
  if (selectedItems.value.includes(item)) {
    selectedItems.value = selectedItems.value.filter(h => h !== item);
  } else {
    selectedItems.value.push(item);
  }
}

// 커스텀 입력 추가
function addCustom() {
  if (customInput.value && !selectedItems.value.some(i => i.pc_name === customInput.value)) {
    selectedItems.value.push({ pc_no: null, pc_name: customInput.value, pc_type: props.type });
    customInput.value = "";
  }
}

// 선택 해제
function removeItem(item) {
  selectedItems.value = selectedItems.value.filter(h => h !== item);
}

// Vuex에 저장
function saveSelected() {
  store.commit(
    "memberCategory/addSelectCategories",
    selectedItems.value.map(item => item.pc_no).filter(no => no !== null)
  );
}
</script>


<!-- <template>
  <div class="card shadow-sm p-4 mb-4">
    <h4 class="mb-3">Your Hobbies</h4>
    <p class="text-muted">Select the hobbies and interests that represent you</p>

    <div class="mb-3">
      <span v-for="(hobby, idx) in selectedHobbies" :key="idx" class="badge bg-dark text-white me-2 p-2">
        {{ hobby.pc_name }}
        <button class="btn-close btn-close-white ms-2" @click="removeHobby(hobby)">
        </button>
      </span>
    </div>

    <div class="input-group mb-3">
      <input v-model="customHobby" placeholder="Enter a custom hobby..." class="form-control" @keyup.enter="addCustomHobby" />
      <button class="btn btn-outline-dark" @click="addCustomHobby">+</button>
    </div>

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
</script> -->
