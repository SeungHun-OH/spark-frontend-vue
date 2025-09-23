<template>

  <div class="d-flex align-items-center">
    <img v-if="profileImage" :src="profileImage" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover;" class = "me-2" />
    <!-- <img v-else src="@/assets/profile.png" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover;" /> -->
    <div v-if="m_id">
      <div class="fw-bold"> id : {{ m_id }}</div>
      <div class="fw-bold"> na : {{ m_name }}</div>
    </div>
  </div>

</template>

<script setup>

import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const m_id = computed(() => {
  return store.getters["member/getM_id"]
});

const m_name = computed(() => {
  return store.getters["member/getM_name"]
});

const profileImage = computed(() => {
  const data = store.getters["member/getM_attachdata"];
  return data ? `data:image/png;base64,${data}` : null;
});

</script>

<style scoped></style>
