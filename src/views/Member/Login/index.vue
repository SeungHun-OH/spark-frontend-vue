<template>
  <!-- 카드 -->
  <div class="d-flex justify-content-center align-items-start min-vh-150">

    <div class="card shadow-sm p-4" style="width: 380px;">
      <h4 class="text-center mb-4">Welcome Back</h4>

      <form @submit.prevent="handleLogin">
        <!-- Email -->
        <div class="mb-3">
          <label class="form-label">mid</label>
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-envelope"></i>
            </span>
            <input type="text" class="form-control" v-model="member.mid" placeholder="Enter your id" required />
          </div>
        </div>

        <!-- Password -->
        <div class="mb-3">
          <label class="form-label">Password</label>
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-lock"></i>
            </span>
            <input :type="showPassword ? 'text' : 'password'" class="form-control" v-model="member.mpassword" placeholder="Enter your password" required />
            <button class="btn btn-outline-secondary" type="button" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <!-- 로그인 버튼 -->
        <div class="d-grid mb-3">
          <button type="submit" class="btn btn-danger">Sign In</button>
        </div>
      </form>

      <!-- 하단 링크 -->
      <div class="text-center">
        <a href="#" class="text-decoration-none me-3">Forgot password?</a>
        <a href="#" class="text-decoration-none">Sign Up</a>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';


const store = useStore();
const router = useRouter();

const member = ref({
  mid: "user",
  mpassword : "123456"
});

// async function handleLogin(){
//   try{
//     const data = structuredClone(member.value);
//   }
// }

</script>
