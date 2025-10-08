<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow-sm p-4" style="width: 360px;">
      <div class="text-center mb-4">
        <h3 class="fw-bold text-success">MyApp</h3>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="username" class="form-label">아이디</label>
          <input
            type="text"
            id="username"
            v-model="form.username"
            class="form-control"
            placeholder="아이디를 입력하세요"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">비밀번호</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            class="form-control"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>

        <button type="submit" class="btn btn-success w-100">
          로그인
        </button>
      </form>

      <div class="d-flex justify-content-between mt-3">
        <a href="#" class="small text-muted">아이디 찾기</a>
        <a href="#" class="small text-muted">비밀번호 찾기</a>
        <a href="#" class="small text-muted">회원가입</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  username: "",
  password: "",
});

function handleLogin() {
  // TODO: 실제 로그인 API 연동
  if (form.username === "test" && form.password === "1234") {
    console.log("로그인 성공");
    // 로그인 성공 시 홈 화면으로 이동
    router.push("/home");
  } else {
    alert("아이디 또는 비밀번호가 올바르지 않습니다.");
  }
}
</script>