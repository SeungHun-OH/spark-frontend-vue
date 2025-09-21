<template>

  <div class="d-flex align-items-center">
    <img v-if="profileImage" :src="profileImage" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
    <img v-else src="@/assets/profile.png" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
    <div>
      <div class="fw-bold"> {{ store.getters["member / getM_id"] }}</div>
      <div class="fw-bold"> {{ store.getters["member / getM_name"] }}</div>
    </div>
  </div>

</template>

<script setup>

import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const profileImage = computed(() => {
  const data = store.getters["member/getM_attachdata"];
  return data ? `data.image/png.base64,${data}` : null;
});

</script>

<style scoped></style>
