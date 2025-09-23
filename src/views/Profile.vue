<template>
  <div>
    <h4>Profile</h4>
    <div class="card p-3">
      <div class="d-flex align-items-center mb-3">
        <img src="https://i.pravatar.cc/100" class="rounded-circle me-3" />
        <div>
          <h5>Alex Johnson</h5>
          <p class="text-muted">ffd@naver.com</p>
        </div>
      </div>
      <p>Software engineer, passionate about design and coding.</p>
      <button class="btn btn-outline-primary" @click="GoProfile()">Edit Profile</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

// 별도의 상태가 필요 없으므로 그냥 비워둠

const router = useRouter();

function GoProfile(){
  router.push("/Member/Profile");
}
</script>
