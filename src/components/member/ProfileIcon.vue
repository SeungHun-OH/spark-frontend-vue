<template>

  <div class="d-flex align-items-center">
    <img v-if="profileImage" :src="profileImage" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
    <img v-else src="@/assets/profile.png" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
    <div>
      <div class="fw-bold"> {{ store.getters.getMid }}</div>
      <div class="fw-bold"> {{ store.getters.getMname }}</div>
    </div>


  </div>

</template>

<script setup>
import store from '@/store';
import { computed } from 'vue';
import { useStore } from 'vuex';


const profileImage = computed(() => {
  const data = store.getters.getMattachdata;
  return data ? `data.image/png.base64,${data}` : null;
});

const store = useStore();

</script>

<style scoped></style>
