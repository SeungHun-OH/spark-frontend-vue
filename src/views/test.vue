<script setup>
import { ref } from 'vue';
import feedApi from '@/apis/feedApi'; // feed, feedPicture 관련 API 모듈

// 모달에 표시할 feed와 feedPicture
const modalFeed = ref(null); 
const modalPictures = ref([]);

// 모달 상태
const showModal = ref(false);

// 현재 모달에서 보고 있는 이미지 인덱스
const currentImageIndex = ref(0);

/**
 * f_no에 해당하는 feed와 feedPicture 가져오기
 */
async function openFeedModal(f_no) {
  try {
    // 1. Feed 정보 가져오기
    const feedResponse = await feedApi.getFeed(f_no);
    modalFeed.value = feedResponse.data.data; // wrapper 내부 feed 객체

    // 2. FeedPicture 배열 가져오기
    const pictureResponse = await feedApi.getFeedPictures(f_no);
    modalPictures.value = pictureResponse.data.data; // 배열 형태

    // 첫 번째 이미지부터 보여주기
    currentImageIndex.value = 0;
    showModal.value = true;

    // 스크롤 방지
    document.body.style.overflow = 'hidden';
  } catch (error) {
    console.error(error);
  }
}

// 모달 닫기
function closeModal() {
  modalFeed.value = null;
  modalPictures.value = [];
  showModal.value = false;
  document.body.style.overflow = 'auto';
}

// 다음 이미지
function nextImage() {
  if (currentImageIndex.value < modalPictures.value.length - 1) {
    currentImageIndex.value++;
  }
}

// 이전 이미지
function prevImage() {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
}
</script>
