<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-wrapper">
      <!-- 왼쪽: AI 상담 -->
      <div class="modal-content">
        <h4 class="mb-3">💬 AI 고민상담</h4>

        <textarea
          v-model="question"
          class="form-control mb-3"
          rows="4"
          placeholder="고민을 입력해주세요..."
        ></textarea>

        <div class="d-flex justify-content-end">
          <button class="btn btn-secondary me-2" @click="$emit('close')">닫기</button>
          <button class="btn btn-primary" @click="askAI" :disabled="loading">
            {{ loading ? "AI가 생각 중..." : "AI에게 상담받기 💡" }}
          </button>
        </div>

        <!-- ✅ AI 답변 -->
        <div v-if="answer" class="mt-3 p-3 bg-light rounded">
          <h6 class="fw-bold mb-2">🧠 추출된 키워드</h6>
          <div class="d-flex flex-wrap gap-2 mb-3">
            <span
              v-for="(k, i) in keywords"
              :key="i"
              class="badge bg-secondary"
            >
              {{ k }}
            </span>
          </div>

          <h6 class="fw-bold mb-2">🤖 AI의 상담 결과</h6>
          <p v-if="loading" class="text-secondary fst-italic mb-0">
            ⏳ AI가 답변을 준비 중이에요...
          </p>
          <p v-if="answer" class="mb-0" style="white-space: pre-line">
            {{ answer }}
          </p>

          <div class="text-end mt-3">
            <button
              class="btn btn-outline-primary btn-sm"
              @click="toggleReference"
            >
              {{ showReference ? "참고글 닫기 ❌" : "자세히 분석하기 🔎" }}
            </button>
          </div>
        </div>
      </div>

      <!-- 오른쪽: 참고 게시판 -->
      <transition name="slide">
        <ThreadAiQuetionRef
          v-if="showReference"
          :boards="boards"
          @close="showReference = false"
        />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import aiGenerate from "@/apis/aiGenerate";
import ThreadAiQuetionRef from "./ThreadAiQuetionRef.vue";

const props = defineProps({ show: Boolean });
const question = ref("");
const answer = ref("");
const keywords = ref([]);
const boards = ref([]);
const loading = ref(false);
const showReference = ref(false);

const askAI = async () => {
  if (!question.value.trim()) return alert("고민을 입력해주세요!");
  loading.value = true;
  answer.value = "";
  showReference.value = false;

  try {
    const response = await aiGenerate.generateAnswerBoardQuestion(question.value);
    answer.value = response.data.answer;
    keywords.value = response.data.keywords;
    boards.value = response.data.boards || [];
  } catch (err) {
    console.error(err);
    answer.value = "AI 서버 연결에 문제가 있습니다.";
  } finally {
    loading.value = false;
  }
};

const toggleReference = () => {
  showReference.value = !showReference.value;
};
</script>

<style scoped>
/* ✅ 전체 배경 */
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: rgba(0, 0, 0, 0.5);
  padding: 2rem 0;
  overflow-y: auto;
}

/* ✅ flex 컨테이너 */
.modal-wrapper {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

/* ✅ 메인 모달 */
.modal-content {
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 600px; /* ✅ 가로 폭 줄임 */
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

/* ✅ 내부 스크롤 */
.bg-light.rounded {
  max-height: 60vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
}

/* ✅ 어두운 모드 */
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

/* ✅ 슬라이드 애니메이션 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>