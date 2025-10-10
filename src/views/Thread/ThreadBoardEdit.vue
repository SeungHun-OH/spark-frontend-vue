<template>
  <div v-if="show" class="modal-overlay d-flex justify-content-center align-items-center">
    <div class="modal-box p-4 rounded-4 shadow-lg">
      <h5 class="mb-3">📝 게시글 수정</h5>

      <!-- 제목 -->
      <div class="mb-3">
        <label class="form-label fw-bold">제목</label>
        <input v-model="editedPost.tbTitle" type="text" class="form-control" placeholder="제목을 입력하세요" />
      </div>

      <!-- 내용 -->
      <div class="mb-3">
        <label class="form-label fw-bold">내용</label>
        <textarea v-model="editedPost.tbContent" class="form-control" rows="5" placeholder="내용을 입력하세요"></textarea>
      </div>

      <!-- 버튼 -->
      <div class="d-flex justify-content-end">
        <button class="btn btn-outline-secondary me-2" @click="$emit('close')">취소</button>
        <button class="btn btn-primary" @click="submitEdit">수정 완료</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import threadboardApi from "@/apis/threadboardApi";

const props = defineProps({
  show: Boolean,
  post: Object,
});

const emit = defineEmits(["close", "updated"]);

const editedPost = reactive({
  tbNo: null,
  tbTitle: "",
  tbContent: "",
  tbMemberNo: "", // memberNo 추가
});

watch(
  () => props.post,
  (val) => {
    if (val) {
      editedPost.tbNo = val.tbNo;
      editedPost.tbTitle = val.tbTitle;
      editedPost.tbContent = val.tbContent;
      editedPost.tbMemberNo = val.tbMemberNo; // memberNo도 복사
    }
  },
  { immediate: true }
);

const submitEdit = async () => {
  if (!editedPost.tbTitle.trim() || !editedPost.tbContent.trim()) {
    alert("제목과 내용을 모두 입력해주세요.");
    return;
  }

  try {
    const res = await threadboardApi.updateThreadBoard(editedPost);
    console.log("수정 응답:", res.data);
    if (res.data.result === "success") {
      alert("게시글이 성공적으로 수정되었습니다!");
      emit("updated", { ...editedPost });
      emit("close");
    } else {
      alert("게시글 수정에 실패했습니다.");
    }
  } catch (err) {
    console.error("수정 실패:", err);
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 2000;
}

.modal-box {
  width: 480px;
  background-color: var(--color-bg-card);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

/* 입력창 스타일 */
.form-control {
  background-color: var(--color-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.form-control::placeholder {
  color: var(--color-text-muted);
}

/* 버튼 스타일 */
.btn-primary {
  background-color: var(--color-accent);
  border-color: var(--color-accent);
}

.btn-primary:hover {
  opacity: 0.85;
}

.btn-outline-secondary {
  border-color: var(--color-border);
  color: var(--color-text);
}

.btn-outline-secondary:hover {
  background-color: var(--color-bg-hover);
}
</style>
