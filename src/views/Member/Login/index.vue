<template>
  <!-- 카드 -->
  <div class="d-flex justify-content-center align-items-start min-vh-100">
    <div class="card shadow-sm p-4" style="width: 380px; border-radius: 12px;">
      <h4 class="text-center mb-4 fw-bold">Login</h4>

      <form @submit.prevent="handleLogin">
        <!-- 아이디 -->
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="mid" v-model="member.mId" placeholder="아이디" required />
          <label for="mid"><i class="bi bi-person me-2"></i>아이디</label>
        </div>

        <!-- 비밀번호 -->
        <div class="form-floating mb-3">
          <input :type="showPassword ? 'text' : 'password'" class="form-control" id="mpassword" v-model="member.mPassword" placeholder="비밀번호" required />
          <label for="mpassword"><i class="bi bi-lock me-2"></i>비밀번호</label>
          <button class="btn btn-sm btn-outline-secondary mt-2" type="button" @click="showPassword = !showPassword">
            <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>

        <!-- 로그인 버튼 -->
        <button type="submit" class="btn btn-danger w-100 py-2 fw-bold">로그인</button>
      </form>

      <!-- 하단 링크 -->
      <div class="text-center mt-3">
        <a href="#" class="text-decoration-none me-3">비밀번호 찾기</a>
        <a href="/Member/Sign" class="text-decoration-none">회원가입</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import memberApi from "@/apis/memberApi";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();

const showPassword = ref(false);

const member = ref({
  mId: "user3",
  mPassword: "123456"
});

async function handleLogin() {
  try {
    const payload = { ...member.value };   // 순수 JSON으로 변환

    const response = await memberApi.memberLogin(payload);

    if (response.data.result === "success") {
      alert(response.data.message);
      console.log(response.data);

      const mNo = response.data.data.mNo;

      // dispatch login vuex에 로그인 정보 저장
      store.dispatch("member/saveAuth", {
        ...response.data.data,
        jwt: response.data.jwt,
      });

      // dispatch Login Photo vuex에 로그인 정보 저장
      const photoRes = await memberApi.memberPictureGet(mNo);
      console.log(photoRes.data);

      if (photoRes.data) {
        store.dispatch("member/savePhoto", {
          mAttachData: photoRes.data.data.mpAttachData
        });
      }

      await router.push("/");
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    alert("로그인 실패: " + error);
  }
}
</script>

<style scoped>
body {
  background-color: #f8f9fa;
}
</style>
