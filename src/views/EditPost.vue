<template>
  <div class="container mt-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5>Edit Post</h5>
      <div>
        <button class="btn btn-danger me-2" @click="deletePost">Delete</button>
        <button class="btn btn-secondary" @click="saveChanges" :disabled="photos.length === 0">Save</button>
      </div>
    </div>

    <!-- Photos -->
    <div class="mb-3">
      <label class="form-label fw-bold">Photos ({{ photos.length }}/5)</label>

      <!-- Add Photo 버튼 -->
      <div class="mb-2 d-flex justify-content-end gap-2">
        <button class="btn btn-outline-secondary btn-sm" @click="fileInput.click()">+ Add Photo</button>
        <input type="file" multiple accept="image/*" hidden ref="fileInput" @change="handleUpload" />
      </div>

      <!-- 사진 없을 때 안내 -->
      <div
        v-if="!photos.length"
        class="border border-secondary rounded d-flex flex-column align-items-center justify-content-center p-5 text-muted"
        style="border-style: dashed; cursor: pointer;"
        @click="fileInput.click()"
      >
        <i class="bi bi-upload" style="font-size: 2rem;"></i>
        <p class="mb-1">Select photos</p>
        <small>Click here to choose images for your post (max 5)</small>
      </div>

      <!-- 사진 있을 때 미리보기 -->
      <div v-if="photos.length" class="mt-3">
        <!-- 메인 이미지 캐러셀 -->
        <div class="position-relative text-center rounded p-3" style="background:#f7f7f7;">
          <img :src="photos[currentIndex].url" class="img-fluid rounded" style="max-height:400px;" />
          <button
            class="btn btn-dark position-absolute top-50 start-0 translate-middle-y"
            @click="prevPhoto"
            :disabled="currentIndex === 0"
          >‹</button>
          <button
            class="btn btn-dark position-absolute top-50 end-0 translate-middle-y"
            @click="nextPhoto"
            :disabled="currentIndex === photos.length - 1"
          >›</button>
          <div class="position-absolute top-0 end-0 bg-dark text-white px-2 py-1 rounded">
            {{ currentIndex + 1 }}/{{ photos.length }}
          </div>
        </div>

        <!-- 썸네일 리스트 -->
        <div class="d-flex gap-2 mt-2 flex-wrap">
          <div
            v-for="(photo, index) in photos"
            :key="index"
            class="position-relative"
            style="width: 80px; height: 80px;"
          >
            <img
              :src="photo.url"
              class="w-100 h-100 rounded"
              style="object-fit: cover; cursor: pointer;"
              @click="currentIndex = index"
            />
            <button class="btn btn-sm btn-danger position-absolute top-0 end-0" @click.stop="removePhoto(index)">
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Caption -->
    <div class="mb-3">
      <label class="form-label fw-bold">Caption</label>
      <textarea
        class="form-control"
        v-model="caption"
        maxlength="500"
        rows="3"
        placeholder="Write a caption for your post..."
      ></textarea>
      <small class="text-muted">{{ caption.length }}/500 characters</small>
    </div>

    <!-- Bottom Buttons -->
    <div class="d-flex justify-content-end gap-2">
      <button class="btn btn-outline-secondary" @click="cancel">Cancel</button>
      <button class="btn btn-danger" @click="deletePost">Delete Post</button>
      <button class="btn btn-dark" @click="saveChanges" :disabled="photos.length === 0">Save Changes</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import feedApi from "@/apis/feedApi";
import feedPictureApi from "@/apis/feedPictureApi";

const router = useRouter();
const route = useRoute();
const fNo = ref(route.params.fNo);

const photos = ref([]); // [{ file?, url, isExisting, fpNo? }]
const caption = ref("");
const currentIndex = ref(0);
const fileInput = ref(null);

// 파일 업로드 처리
function handleUpload(event) {
  const input = event.target;
  const fileList = input.files;
  if (!fileList || fileList.length === 0) {
    input.value = "";
    return;
  }

  for (let i = 0; i < fileList.length; i++) {
    if (photos.value.length >= 5) break;
    const file = fileList[i];
    //blob
    const url = URL.createObjectURL(file);
    photos.value.push({ 
      file, 
      url, 
      isExisting: false });
  }

  input.value = "";
}

// 사진 삭제 처리 (db연동)
async function removePhoto(index) {
  const photo = photos.value[index];

  if (photo.isExisting && photo.fpNo) {
    try {
      await feedPictureApi.deleteFeedPicture(photo.fpNo);
    } catch (err) {
      alert("기존 사진 삭제 중 오류가 발생했습니다.");
      return;
    }
  } else if (photo.url.startsWith("blob:")) {
    URL.revokeObjectURL(photo.url);
  }

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

// 수정 취소
function cancel() {
  if (confirm("수정을 취소하시겠습니까?")) {
    router.push("/feed");
  }
}

// 데이터 불러오기
async function loadPost() {
  try {
    const feedRes = await feedApi.getFeed(fNo.value);
    caption.value = feedRes.data.data.feed.fContent;

    const pictureRes = await feedPictureApi.getFeedPictureList(fNo.value);
    const pictureList = pictureRes.data.data;

    photos.value = pictureList.map((pic) => ({
      url: `http://localhost:8040/feedPicture/picture/${pic.fpNo}`,
      isExisting: true,
      fpNo: pic.fpNo,
    }));
  } catch (err) {
    console.error("게시글 불러오기 실패:", err);
  }
}

// 저장
async function saveChanges() {
  if (photos.value.length === 0) {
    alert("최소 1장의 사진이 필요합니다.");
    return;
  }

  const formData = new FormData();
  const feed = {
    fNo: fNo.value,
    fContent: caption.value,
  };

  formData.append("feed", new Blob([JSON.stringify(feed)], { type: "application/json" }));

  photos.value
    .filter((p) => !p.isExisting)
    .forEach((p) => formData.append("files", p.file));

  try {
    await feedApi.updateFeed(formData);
    alert("수정되었습니다!");
    router.push("/feed");
  } catch (err) {
    console.error("수정 실패:", err);
    alert("사진 수정 중 오류가 발생했습니다.");
  }
}

onMounted(() => {
  loadPost();
});
</script>

<style scoped>
img {
  transition: 0.2s;
}
img:hover {
  opacity: 0.9;
}
</style>
