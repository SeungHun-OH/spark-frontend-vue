<template>
  <!-- ✅ 모달 오버레이 -->
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <h4 class="mb-3">💬 AI 고민상담</h4>

      <!-- 입력창 -->
      <textarea v-model="question" class="form-control mb-3" rows="4" placeholder="고민을 입력해주세요..."></textarea>

      <!-- 버튼 -->
      <div class="d-flex justify-content-end">
        <button class="btn btn-secondary me-2" @click="$emit('close')">
          닫기
        </button>
        <button class="btn btn-primary" @click="askAI" :disabled="loading">
          {{ loading ? "AI가 생각 중..." : "AI에게 상담받기 💡" }}
        </button>
      </div>

      <!-- 결과 -->
      <div v-if="answer" class="mt-3 p-3 bg-light rounded">
        <h6 class="fw-bold mb-2">🧠 추출된 키워드</h6>
        <div class="d-flex flex-wrap gap-2 mb-3">
          <span v-for="(k, i) in keywords" :key="i" class="badge bg-secondary">
            {{ k }}
          </span>
        </div>

        <h6 class="fw-bold mb-2">🤖 AI의 상담 결과</h6>
        <!-- <p style="white-space: pre-line;">{{ answer }}</p> -->
        <!-- 아직 답변이 없을 때 -->
        <p v-if="!answer && !loading" class="text-muted mb-0">
          💬 아직 AI의 응답이 없습니다. 고민을 입력하고 상담을 받아보세요.
        </p>

        <!-- 로딩 중일 때 -->
        <p v-if="loading" class="text-secondary fst-italic mb-0">
          ⏳ AI가 답변을 준비 중이에요...
        </p>

        <!-- AI 답변이 도착했을 때 -->
        <p v-if="answer" class="mb-0" style="white-space: pre-line;">
          {{ answer }}
        </p>

        <div class="text-end mt-3">
          <button class="btn btn-outline-primary btn-sm" @click="goDetail">
            자세히 분석하기 🔎
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import aiGenerate from "@/apis/aiGenerate";
import { ref } from "vue";


const props = defineProps({
  show: Boolean,
});
const question = ref("");
const answer = ref("Ai 답변을 받아보아요");
const loading = ref(false);

const askAI = async () => {
  if (!question.value.trim()) return alert("고민을 입력해주세요!");
  loading.value = true;
  answer.value = "";

  try {
    const response = await aiGenerate.generateAnswerBoardQuestion(question.value);
    answer.value = response.data;

    console.log("질문" + question.value + "\n AI연애상담 답변" + response.data)
  } catch (err) {
    console.error(err);
    answer.value = "AI 서버 연결에 문제가 있습니다.";
  } finally {
    loading.value = false;
  }
};
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 800px;
  max-height: 120vh;
  overflow-y: auto;
}

/* 🌙 다크모드 강제 반영 */
:deep(.dark) .modal-content {
  background-color: #2c2c2c !important;
  color: #f1f1f1 !important;
  border: 1px solid #333 !important;
}

:deep(.dark) .form-control,
:deep(.dark) textarea {
  background-color: #3a3a3a !important;
  color: #fff !important;
  border: 1px solid #555 !important;
}
</style>
