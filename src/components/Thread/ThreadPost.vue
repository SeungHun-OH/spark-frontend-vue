




<template>
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
</script>
