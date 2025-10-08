<template>
  <div class="container mt-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5>Create Post</h5>
      <button class="btn btn-secondary" @click="createPost">Post</button>
    </div>

    <!-- Photos -->
    <div class="mb-3">
      <label class="form-label fw-bold">Photos ({{ photos.length }}/5)</label>

      <!-- Add Photo 버튼 -->
      <div class="mb-2 d-flex justify-content-end gap-2">
        <button class="btn btn-outline-secondary btn-sm" @click="fileInput.click()">+ Add Photo</button>
        <input type="file" multiple accept="image/*" hidden ref="fileInput" @change="handleUpload" />
      </div>

      <!-- 사진이 없을 때 -->
      <div v-if="!photos.length"
        class="border border-secondary rounded d-flex flex-column align-items-center justify-content-center p-5 text-muted"
        style="border-style: dashed; cursor: pointer;" @click="fileInput.click()">
        <i class="bi bi-upload" style="font-size: 2rem;"></i>
        <p class="mb-1">Select photos</p>
        <small>Click here to choose images for your post (max 5)</small>
      </div>

      <!-- 사진이 있을 때 -->
      <div v-if="photos.length" class="mt-3">
        <!-- 큰 이미지 캐러셀 -->
        <div v-if="photos.length > 0 && photos[currentIndex]" class="position-relative text-center rounded p-3"
          style="background:#f7f7f7;">
          <img :src="photos[currentIndex].url" class="img-fluid rounded" style="max-height:400px;" />
          <!-- 좌우 화살표 -->
          <button class="btn btn-dark position-absolute top-50 start-0 translate-middle-y" @click="prevPhoto"
            :disabled="currentIndex === 0">‹</button>
          <button class="btn btn-dark position-absolute top-50 end-0 translate-middle-y" @click="nextPhoto"
            :disabled="currentIndex === photos.length - 1">›</button>
          <!-- 인덱스 표시 -->
          <div class="position-absolute top-0 end-0 bg-dark text-white px-2 py-1 rounded">
            {{ currentIndex + 1 }}/{{ photos.length }}
          </div>
        </div>

        <!-- 썸네일 리스트 -->
        <div class="d-flex gap-2 mt-2 flex-wrap">
          <div v-for="(photo, index) in photos" :key="index" class="position-relative"
            style="width: 80px; height: 80px;">
            <img :src="photo.url" class="w-100 h-100 rounded" style="object-fit: cover; cursor: pointer;"
              @click="currentIndex = index" />
            <!-- 삭제 버튼 -->
            <button class="btn btn-sm btn-danger position-absolute top-0 end-0"
              @click.stop="removePhoto(index)">✕</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Caption -->
    <div class="mb-3">
      <label class="form-label fw-bold">Caption</label>
      <textarea class="form-control" v-model="caption" maxlength="500" rows="3"
        placeholder="Write a caption for your post..."></textarea>
      <small class="text-muted">{{ caption.length }}/500 characters</small>
    </div>

    <!-- Buttons -->
    <div class="d-flex justify-content-end gap-2">
      <button class="btn btn-outline-secondary" @click="cancel">Cancel</button>
      <button class="btn btn-dark" @click="createPost">Create Post</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import feedApi from "@/apis/feedApi";

const router = useRouter();

// 이미지 관련 상태
const photos = ref([]); // [{ file : 원본 파일 (바이너리 그대로), url : base64 (브라우저 미리보기용)}]
const currentIndex = ref(0);
const fileInput = ref(null);

// 게시글 내용
const caption = ref("");

// 파일 업로드 (미리보기)
function handleUpload(event) {
  const input = event.target;
  const fileList = input.files;
  if (!fileList || fileList.length === 0) {
    input.value = ""; //다음 선택을 위해 초기화
    return;
  }

  for (let i = 0; i < fileList.length; i++) {
    if (photos.value.length >= 5)
      break;

    const file = fileList[i];

    const url = URL.createObjectURL(file); //"blob ..." 문자열
    //비동기: 파일을 다 읽고 나면 호출됨
    photos.value.push({
      file,
      url, _blob: true
    });

  }
  //같은 파일을 다시 선택해도 change가 발생하도록 초기화
  input.value = "";
}

// 사진 삭제
function removePhoto(index) {
  photos.value.splice(index, 1);
  if (currentIndex.value >= photos.value.length) {
    currentIndex.value = Math.max(0, photos.value.length - 1);
  }
}

// 캐러셀 이동
function prevPhoto() {
  if (currentIndex.value > 0) currentIndex.value--;
}
function nextPhoto() {
  if (currentIndex.value < photos.value.length - 1) currentIndex.value++;
}

// 취소 버튼
function cancel() {
  if (confirm("게시글 작성을 취소하시겠습니까?")) {
    router.push("/feed");
  }
}

// 게시글 생성
async function createPost() {
  if (!caption.value && photos.value.length === 0) {
    alert("사진이나 내용을 입력해주세요.");
    return;
  }

  const formData = new FormData();

  // Feed 객체 (백엔드 Feed DTO와 맞게)
  const feed = {
    fContent: caption.value,
  };

  formData.append("feed", new Blob([JSON.stringify(feed)], { type: "application/json" }));

  photos.value.forEach((photo) => {
    formData.append("files", photo.file);
  });

  try {
    await feedApi.createFeed(formData);
    alert("게시글이 등록되었습니다!");
    router.push("/feed");
  } catch (error) {
    console.error("게시글 등록 실패:", error);
    alert("게시글 등록 중 오류가 발생했습니다.");
  }
}
</script>

<style scoped>
img {
  transition: 0.2s;
}

img:hover {
  opacity: 0.9;
}
</style>
