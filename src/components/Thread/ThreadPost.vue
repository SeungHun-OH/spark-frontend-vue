<template>
  <div v-if="show" class="modal-overlay d-flex justify-content-center align-items-center">
    <div class="modal-box bg-white text-dark p-3 rounded shadow">

      <!-- 헤더 -->
      <div class="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
        <button class="btn btn-sm btn-outline-secondary" @click="$emit('close')">취소</button>
        <span class="fw-bold">새로운 글쓰기</span>
        <button class="btn btn-sm btn-primary" @click="submitPost" :disabled="!content.trim()">게시</button>
      </div>

      <!-- 작성자 -->
      <div class="d-flex align-items-center mb-2">
        <img src="https://via.placeholder.com/40" class="rounded-circle me-2" />
        <span class="fw-bold">Me</span>
      </div>

      <!-- 글쓰기 textarea (자동 늘어남) -->
      <textarea v-model="content" class="form-control border-0 auto-textarea" placeholder="무슨 생각을 하고 있나요?" rows="1" @input="autoResize"></textarea>

      <!-- 아이콘 버튼들 -->
      <div class="d-flex justify-content-around text-muted mt-3">
        <i class="bi bi-image fs-4 cursor-pointer" title="사진/미디어"></i>
        <i class="bi bi-geo-alt fs-4 cursor-pointer" title="위치 추가"></i>
        <i class="bi bi-emoji-smile fs-4 cursor-pointer" title="이모티콘"></i>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";



const props = defineProps({
  show: Boolean,
});
const emit = defineEmits(["post-added", "close"]);

const content = ref("");

const submitPost = () => {
  if (!content.value.trim()) return;
  const newPost = {
    id: Date.now(),
    author: { nickname: "Me", profileImg: "https://via.placeholder.com/40" },
    content: content.value,
    image: null,
    likes: 0,
    liked: false,
    comments: []
  };
  emit("post-added", newPost);
  content.value = "";
  emit("close");
};

// ✅ textarea 자동 늘어남
const autoResize = (e) => {
  const el = e.target;
  el.style.height = "auto"; // 초기화
  el.style.height = el.scrollHeight + "px"; // 스크롤 높이에 맞춤
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
}

.modal-box {
  width: 500px;
  max-width: 90%;
}

.cursor-pointer {
  cursor: pointer;
}

.auto-textarea {
  resize: none;
  overflow: hidden;
  font-size: 1rem;
}
</style>


<!-- <template>
  <div v-if="show" class="card mb-3">
    <div class="card-body">
      <textarea v-model="content" class="form-control mb-2" rows="3" placeholder="무슨 생각을 하고 있나요?"></textarea>
      <input type="text" v-model="image" class="form-control mb-2" placeholder="이미지 URL (선택)" />
      <button class="btn btn-success btn-sm" @click="submitPost">등록</button>
      <button class="btn btn-secondary btn-sm ms-2" @click="$emit('close')">취소</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  show: Boolean
});

const emit = defineEmits(["post-added", "close"]);

const content = ref("");
const image = ref("");

const submitPost = () => {
  if (!content.value.trim()) return;
  const newPost = {
    id: Date.now(),
    author: { nickname: "Me", profileImg: "https://via.placeholder.com/40" },
    content: content.value,
    image: image.value || null,
    likes: 0,
    liked: false,
    comments: []
  };
  emit("post-added", newPost);
  content.value = "";
  image.value = "";
};
</script> -->
