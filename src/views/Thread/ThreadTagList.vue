<!-- <template>
  <div class="thread-keyword-bar">
    <span class="fw-bold me-2">🔥 인기 키워드</span>
    <button 
      v-for="tag in keywords"
      :key="tag"
      @click="$emit('select', tag)">
      #{{ tag }}
    </button>
  </div>
</template> -->

<template>
  <div class="keyword-list">
    <h6>🔥 인기 키워드</h6>
    <div class="d-flex flex-wrap gap-2">
      <button
        v-for="tag in keywords"
        :key="tag"
        class="btn btn-outline-info btn-sm rounded-pill"
        @click="$emit('select', tag)"
>
        #{{ tag }}
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  keywords: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped>
.keyword-list {
  /* position: fixed; */
  /* top: 100px; */
  /* right: 40px;
  width: 200px; */
}
</style>
