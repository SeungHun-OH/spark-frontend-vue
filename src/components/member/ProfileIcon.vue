<template>

  <div class="d-flex align-items-center">
    <img v-if="profileImage" :src="profileImage" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover;" class = "me-2" />
    <!-- <img v-else src="@/assets/profile.png" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover;" /> -->
    <div v-if="mId">
      <div class="fw-bold"> {{ mName }}</div>
      <div class="fw-bold" style="color: dimgray;"> {{ mId }}</div>
    </div>
  </div>

</template>

<script setup>

import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const mId = computed(() => {
  return store.getters["member/getMEmail"]
  // return store.getters["member/getMId"]
});

const mName = computed(() => {
  return store.getters["member/getMName"]
});

const profileImage = computed(() => {
  const data = store.getters["member/getMAttachData"];
  return data ? `data:image/png;base64,${data}` : null;
});

</script>

<style scoped>
</style>