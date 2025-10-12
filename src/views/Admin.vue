<template>
  <div class="admin-page container py-4">
    <!-- 상단 타이틀 -->
    <h3 class="fw-bold mb-4 text-danger">🛠️ Admin Page</h3>

    <!-- 마스터 모드 -->
    <div class="mb-3">
      <h5>🎮 마스터 모드</h5>
      <p class="small text-muted">모든 권한으로 접근 가능한 관리자 모드입니다.</p>
      <button class="btn btn-dark" @click="toggleMaster">
        {{ isMaster ? '마스터 모드 해제' : '마스터 모드 활성화' }}
      </button>
    </div>

    <hr />

    <!-- DB 전체 삭제 -->
    <div class="mb-3">
      <h5>🧹 DB 전체 삭제</h5>
      <p class="small text-muted">테스트용 데이터 및 모든 테이블 삭제 (주의)</p>
      <button class="btn btn-danger" @click="deleteAllData">⚠️ 전체 삭제</button>
    </div>

    <hr />

    <!-- AI 게시글 생성 -->
    <div class="mb-3">
      <h5>🤖 AI 게시글 생성기</h5>
      <p class="small text-muted">AI로 자동 게시글 생성 (ThreadBoard 테스트용)</p>


      <div class="d-flex align-items-center gap-2 mb-2">
        <input type="number" v-model="count" min="1" class="form-control" placeholder="생성할 게시글 수" style="width: 150px" />
        <button class="btn btn-primary" @click="generateAIBoard">✨ 게시글 생성</button>
      </div>
    </div>

    <!-- 결과 메시지 -->
    <div v-if="message" class="alert alert-info mt-4">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import aiGenerate from "@/apis/aiGenerate";

const isMaster = ref(false);
const message = ref("result message");
const count = ref("");

// ✅ 마스터 모드 토글
const toggleMaster = () => {
  isMaster.value = !isMaster.value;
  message.value = isMaster.value
    ? "마스터 모드가 활성화되었습니다."
    : "마스터 모드가 해제되었습니다.";
};

// ✅ DB 전체 삭제
const deleteAllData = async () => {
  if (!confirm("⚠️ 정말 모든 데이터를 삭제하시겠습니까?")) return;
  try {
    const res = await axios.post("/admin/reset-database", {
      masterKey: "1234", // 🔐 테스트용 (실제는 환경변수)
    });

    message.value = "DB 삭제 완료: " + res.data.message;
  } catch (err) {
    message.value = "DB 삭제 실패: " + err.message;
  }
};

// ✅ AI 게시글 생성
const generateAIBoard = async () => {
  try {
    message.value = "AI 게시글 생성중";
    const response = await aiGenerate.AiGenerateBoards(count.value)
    if (response.data.result === "success") {
      message.value = "AI 게시글 생성 완료: " + response.data.message;
    }
    else{
      message.value = "AI 게시글 생성 실패: " + response.data.message;
    }
  } catch (err) {
    message.value = "게시글 생성 네트워크 오류 실패: " + err.message;
  }
};
</script>

<style scoped>
.admin-page {
  max-width: 800px;
  margin: 0 auto;
}

button {
  min-width: 180px;
}
</style>
