<script setup>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  type: String // "HOBBY", "TRAIT", "IDEALTYPE" ...
});

const store = useStore();
const selectedItems = ref([]);
const customInput = ref("");

// 타입별 카테고리 목록
const options = computed(() => {
  return store.getters["memberCategory/getCategoriesByType"](props.type);
});

// 타입별 메타데이터 (제목/설명)
const meta = computed(() => {
  return store.getters["memberCategory/getTypeMeta"](props.type);
});

// 토글
function toggleItem(item) {
  if (selectedItems.value.includes(item)) {
    selectedItems.value = selectedItems.value.filter(h => h !== item);
  } else {
    selectedItems.value.push(item);
  }
}

// 커스텀 입력
function addCustom() {
  if (customInput.value && !selectedItems.value.some(i => i.pc_name === customInput.value)) {
    selectedItems.value.push({ pc_no: null, pc_name: customInput.value, pc_type: props.type });
    customInput.value = "";
  }
}

// 삭제
function removeItem(item) {
  selectedItems.value = selectedItems.value.filter(h => h !== item);
  store.commit("memberCategory/removeSelectCategory", item.pc_no);
  console.log("removeItem 삭제", item.pc_no);
}

// 저장
function saveSelected() {
  store.commit(
    "memberCategory/addSelectCategories",
    selectedItems.value.map(item => item.pc_no).filter(no => no !== null)
  );
  alert(props.type + "저장완료");
}

watch(selectedItems, (newItems) => {
  const pcNos = newItems.map(item => item.pc_no).filter(no => no !== null);
  store.commit("memberCategory/addSelectCategories", pcNos);
}, {deep: true});
</script>

<template>
  <div class="card shadow-sm p-4 mb-4">
    <h4 class="mb-3">{{ meta.title }}</h4>
    <p class="text-muted">{{ meta.description }}</p>
    <!-- 선택된 항목 -->
    <div class="mb-3">
      <span v-for="(item, idx) in selectedItems" :key="idx" class="badge bg-dark text-white me-2 p-2">
        {{ item.pc_name }}
        <button class="btn-close btn-close-white ms-2" @click="removeItem(item)"></button>
      </span>
    </div>

    <!-- 입력 -->
    <div class="input-group mb-3">
      <input 
        v-model="customInput" 
        :placeholder="`Enter a custom ${props.type.toLowerCase()}...`"
        class="form-control" 
        @keyup.enter="addCustom" />
      <button class="btn btn-outline-dark" @click="addCustom">+</button>
    </div>

    <!-- 옵션 -->
    <h6 class="fw-bold mb-2">Popular {{ props.type }}</h6>
    <div class="d-flex flex-wrap gap-2">
      <button 
        v-for="item in options" 
        :key="item.pc_no" 
        class="btn btn-sm"
        :class="selectedItems.includes(item) ? 'btn-dark text-white' : 'btn-outline-dark'"
        @click="toggleItem(item)">
        {{ item.pc_name }}
      </button>
    </div>

    <div>
      <button class="btn btn-info-primary mt-3" @click="saveSelected">저장</button>
    </div>
  </div>
</template>



