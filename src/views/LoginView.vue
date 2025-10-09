<template>
  <div class="login-container" :class="{ fadeOut: isFadingOut }">
    <div class="text-center mb-4">
      <img src="@/assets/logo.png" alt="Spark Logo" class="logo" />
      <h3 class="app-name">Spark</h3>
      <p class="welcome-text">Welcome back to Spark</p>
    </div>

    <div class="login-card">
      <form @submit.prevent="handleLogin">
        <!-- 아이디 -->
        <div class="form-group">
          <label>아이디</label>
          <div class="input-wrapper">
            <span class="input-icon">👤</span>
            <input
              type="text"
              v-model="loginForm.memberId"
              placeholder="아이디를 입력하세요"
              :disabled="isLoading"
            />
          </div>
          <transition name="fade-slide">
            <p v-if="fieldErrors.memberId" class="error-message">{{ fieldErrors.memberId }}</p>
          </transition>
        </div>

        <!-- 비밀번호 -->
        <div class="form-group">
          <label>비밀번호</label>
          <div class="input-wrapper">
            <span class="input-icon">🔒</span>
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="loginForm.memberPwd"
              placeholder="비밀번호를 입력하세요"
              :disabled="isLoading"
            />
            <span class="input-icon toggle-icon" @click="togglePassword">👁️</span>
          </div>
          <transition name="fade-slide">
            <p v-if="fieldErrors.memberPwd" class="error-message">{{ fieldErrors.memberPwd }}</p>
          </transition>
          <transition name="fade-slide">
            <p v-if="loginError" class="error-message">아이디 또는 비밀번호가 올바르지 않습니다.</p>
          </transition>
        </div>

        <!-- 로그인 버튼 -->
        <button type="submit" class="btn-login" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>로그인</span>
        </button>
      </form>

      <!-- 링크 -->
      <div class="text-center mt-3">
        <a href="#" class="link me-3">비밀번호 찾기</a>
        <a href="#" class="link">회원가입</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import loginApi from '@/apis/login'
import { loginSuccess } from '@/apis/axiosConfig'

const store = useStore()
const router = useRouter()

const loginForm = reactive({
  memberId: '',
  memberPwd: ''
})

const showPassword = ref(false)
const isLoading = ref(false)
const isFadingOut = ref(false)
const loginError = ref(false)

const fieldErrors = reactive({
  memberId: '',
  memberPwd: ''
})

function togglePassword() {
  showPassword.value = !showPassword.value
}

function validateForm() {
  let isValid = true
  fieldErrors.memberId = ''
  fieldErrors.memberPwd = ''

  if (!loginForm.memberId.trim()) {
    fieldErrors.memberId = '아이디를 입력해주세요.'
    isValid = false
  }

  if (!loginForm.memberPwd.trim()) {
    fieldErrors.memberPwd = '비밀번호를 입력해주세요.'
    isValid = false
  }

  return isValid
}

async function handleLogin() {
  loginError.value = false

  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    const response = await loginApi.loginMemebr(loginForm)
    const memberInfo = response.data.data

    store.commit("auth/setMemberUuid", memberInfo.memberUuid)
    store.commit("auth/setJwtToken", memberInfo.jwtToken)
    loginSuccess(memberInfo.jwtToken)

    isFadingOut.value = true
    setTimeout(() => {
      router.push('/')
    }, 600)
  } catch (error) {
    loginError.value = true
    console.log("로그인 실패:", error.response?.data?.message || error.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 전체 배경 및 정렬 */
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #fff;
  transition: opacity 0.6s ease;
}
.login-container.fadeOut {
  opacity: 0;
}

/* 로고 및 텍스트 */
.logo {
  width: 50px;
  height: 50px;
}

.app-name {
  font-weight: 700;
  font-size: 32px;
  margin-top: 20px;
  margin-bottom: 10px;
}

.welcome-text {
  color: #888;
  margin-bottom: 20px;
}

/* 로그인 카드 */
.login-card {
  width: 380px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

/* 입력 그룹 */
.form-group {
  margin-bottom: 20px;
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  padding: 10px 40px 10px 36px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f9f9f9;
}

.input-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 10px;
  font-size: 16px;
  color: #888;
}

.toggle-icon {
  left: auto;
  right: 10px;
  cursor: pointer;
}

/* 에러 메시지 */
.error-message {
  color: #e74c3c;
  font-size: 13px;
  margin-top: 8px;
  padding-left: 4px;
}

/* 에러 애니메이션 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-5px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* 로그인 버튼 */
.btn-login {
  width: 100%;
  padding: 10px;
  background-color: #f24141;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: relative;
}
.btn-login:hover {
  background-color: #d93232;
}
.btn-login:disabled {
  background-color: #f77c7c;
  cursor: not-allowed;
}

/* 로딩 스피너 */
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid white;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 링크 */
.link {
  font-size: 14px;
  color: #333;
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
}
</style>
