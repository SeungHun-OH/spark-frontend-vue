<template>

  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <h4 class="mb-3">💬 AI 고민상담</h4>

      <textarea v-model="question" class="form-control mb-3" rows="4" placeholder="고민을 입력해주세요..."></textarea>

      <div class="d-flex justify-content-end">
        <button class="btn btn-secondary me-2" @click="$emit('close')">
          닫기
        </button>
        <button class="btn btn-primary" @click="askAI" :disabled="loading">
          {{ loading ? "AI가 생각 중..." : "AI에게 상담받기 💡" }}
        </button>
      </div>

      <div v-if="answer" class="mt-3 p-3 bg-light rounded">
        <h6 class="fw-bold mb-2">🧠 추출된 키워드</h6>
        <div class="d-flex flex-wrap gap-2 mb-3">
          <span v-for="(k, i) in keywords" :key="i" class="badge bg-secondary">
            {{ k }}
          </span>
        </div>

        <h6 class="fw-bold mb-2">🤖 AI의 상담 결과</h6>
        <p v-if="!answer && !loading" class="text-muted mb-0">
          💬 아직 AI의 응답이 없습니다. 고민을 입력하고 상담을 받아보세요.
        </p>

        <p v-if="loading" class="text-secondary fst-italic mb-0">
          ⏳ AI가 답변을 준비 중이에요...
        </p>

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
const keywords = ref([]);
const loading = ref(false);

const askAI = async () => {
  if (!question.value.trim()) return alert("고민을 입력해주세요!");
  loading.value = true;
  answer.value = "";

  try {
    const response = await aiGenerate.generateAnswerBoardQuestion(question.value);
    answer.value = response.data.answer;
    keywords.value = response.data.keywords;

    console.log("질문" + question.value + "\n\n AI연애상담 답변" + response.data. answer + "\n\n 검색 키워드" + response.data.keywords + "\n\n 참고 게시판" + response.data.boards)
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
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* ✅ 상단 정렬로 변경 */
  overflow-y: auto;        /* ✅ 모달 전체 스크롤 가능 */
  background: rgba(0, 0, 0, 0.5);
  padding: 2rem 0;
}

.modal-content {
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 800px;
  max-height: 80vh;          /* ✅ 세로 최대 크기 고정 */
  display: flex;
  flex-direction: column;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  min-height: 100px;
  max-height: 60vh;          /* 실제 스크롤이 생기는 높이 */
  padding-right: 8px;
}

.bg-light.rounded {
  max-height: 60vh; /* 화면 높이의 60%까지만 표시 */
  overflow-y: auto; /* 내부에서 스크롤 가능하게 */
  overflow-x: hidden;
  padding-right: 8px; /* 스크롤 생겨도 글자 안 잘리게 */
}

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
