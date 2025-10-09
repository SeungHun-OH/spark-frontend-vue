<template>
  <div class="d-flex">
    <div class="flex-grow-1 container py-3">

      <!-- 헤더 -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>🌱 Writing App (Community)</h4>
        <button class="btn btn-primary btn-sm" @click="showForm = !showForm">✍️ 글쓰기</button>
      </div>

      <!-- 글쓰기 폼 -->
      <ThreadPost :show="showForm" @post-added="addPost" @close="showForm = false" />

      <!-- 검색창 -->
      <div class="mb-3">
        <input v-model="keyword" type="text" placeholder="검색어 입력..." class="form-control" @keyup.enter="searchPosts(keyword)" />
      </div>

      <!-- 스크롤 박스 -->
      <div class="scroll-box" @scroll="handleScroll">
        <div v-for="post in posts" :key="post.tbNo" class="card mb-3">
          <div class="card-body">

            <!-- 프로필 + 닉네임/아이디 + 시간 + 수정삭제버튼 -->
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="d-flex align-items-center">
                <img :src="post.memberPicture ? `data:image/png;base64,${post.memberPicture}` : '/assets/profile.png'" alt="프로필" class="post-thumbnail rounded-circle me-2" width="40" height="40" />
                <div>
                  <span class="fw-bold">{{ post.memberName }}</span>
                  <span class="text-muted"> | {{ post.memberId }}</span>
                  <small class="text-muted ms-2">· {{ timeAgo(post.createdAt) }}</small>
                </div>
              </div>

              <!-- 로그인한 유저 == 글쓴이일 때만 수정/삭제 버튼 -->
              <!-- <div v-if="isMyPost(post)"> -->
              <div v-if="store.getters['member/getMNo'] == post.tbMemberNo">
                <button class="btn btn-outline-secondary btn-sm me-2" @click="editPost(post)">✏️ 수정</button>
                <button class="btn btn-outline-danger btn-sm" @click="deletePost(post)">🗑 삭제</button>
              </div>
            </div>

            <!-- 제목 + 내용 -->
            <p class="post-title mb-1" v-html="highlightText(post.tbTitle, keyword)"></p>
            <p class="post-content mb-2" v-html="highlightText(post.tbContent, keyword)"></p>

            <!-- <p class="post-title mb-1">{{ post.tbTitle }}</p>
            <p class="post-content mb-2">{{ post.tbContent }}</p> -->

            <!-- 좋아요 + 댓글 보기 -->
            <div class="d-flex justify-content-between align-items-center mt-2">
              <button class="btn btn-outline-danger btn-sm" @click="toggleLike(post)">
                ❤️ {{ post.tbLikeCount }}
              </button>

              <button class="btn btn-outline-info btn-sm" @click="toggleComments(post)">
                💬 댓글 {{ post.boardReplys ? post.boardReplys.length : 0 }}
              </button>
            </div>

            <!-- 댓글 리스트 -->
            <div v-if="post.showComments" class="mt-3">
              <div v-for="reply in post.boardReplys" :key="reply.brNo" class="d-flex mb-3 p-2 rounded comment-item">

                <img :src="reply.memberPicture ? `data:image/png;base64,${reply.memberPicture}` : '/default-profile.png'" alt="댓글 프로필" class="rounded-circle me-3" width="35" height="35" />

                <div class="flex-grow-1">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <span class="fw-semibold">{{ reply.memberName }}</span>
                      <span class="text-muted small ms-1">· {{ timeAgo(reply.createdAt) }}</span>
                    </div>
                    <button class="btn btn-sm p-0 text-muted like-btn" @click="toggleReplyLike(reply)">
                      <i :class="reply.liked ? 'bi bi-heart-fill text-danger' : 'bi bi-heart'"></i>
                    </button>

                    <div v-if="store.getters['member/getMNo'] == reply.brMemberNo">

                      <!-- 수정모드가 아닐 때 -->
                      <template v-if="!reply.editing">
                        <button class="btn btn-outline-secondary btn-sm ms-2 py-0 px-2" @click="reply.editing = true">
                          수정
                        </button>
                        <button class="btn btn-outline-danger btn-sm py-0 px-2" @click="deleteReply(post, reply)">
                          삭제
                        </button>
                      </template>

                      <!-- 수정모드일 때 -->
                      <template v-else>
                        <button class="btn btn-primary btn-sm ms-2 py-0 px-2" @click="saveReplyEdit(post, reply)">
                          저장
                        </button>
                        <button class="btn btn-secondary btn-sm py-0 px-2" @click="cancelReplyEdit(reply)">
                          취소
                        </button>
                      </template>

                      <!-- <button class="btn btn-outine-secondary btn-sm ms-2 py-0 px-2" @click="editReply(post, reply)"> 수정 </button> -->
                      <!-- <button class="btn btn-outline-danger btn-sm py-0 px-2" @click="deleteReply(post, reply)"> 삭제 </button> -->

                    </div>

                  </div>

                  <!-- 댓글 내용 or 수정 input -->
                  <div class="mt-1 small" style="white-space: pre-line;">
                    <template v-if="!reply.editing">
                      {{ reply.brContent }}
                    </template>
                    <template v-else>
                      <input v-model="reply.tempContent" class="form-control form-control-sm bg-dark text-light border-secondary mt-1" placeholder="수정할 내용을 입력하세요..." />
                    </template>
                  </div>

                  <!-- 댓글 내용 -->
                  <!-- <div class="text-light mt-1 small" style="white-space: pre-line;">
                    {{ reply.brContent }}
                  </div> -->

                </div>
              </div>

              <!-- 댓글 입력창 -->
              <div class="mt-2 d-flex align-items-center">
                <img :src="userProfile" class="rounded-circle me-2" width="35" height="35" />
                <input v-model="newComment" type="text" class="form-control form-control-sm rounded-pill bg-dark text-light border-secondary me-2" placeholder="댓글 달기..."
                  @keyup.enter="addComment(post)" />
                <button class="btn btn-primary btn-sm rounded-pill px-3" @click="addComment(post)">등록</button>
              </div>
            </div>

          </div>
        </div>

        <!-- 로딩 -->
        <div v-if="loading" class="text-center py-3">
          <div class="spinner-border"></div>
        </div>
      </div>

    </div>
  </div>

  <!-- ✏️ 게시글 수정 모달 -->
  <ThreadBoardEdit :show="showEditModal" :post="selectedPost" @close="showEditModal = false" @updated="onPostUpdated" />

</template>


<script setup>
import { ref, onMounted, computed } from "vue";
import ThreadPost from "@/components/Thread/ThreadPost.vue";
import threadboardApi from "@/apis/threadboardApi";
import { useStore } from "vuex";
import ThreadBoardEdit from "./ThreadBoardEdit.vue";

const showEditModal = ref(false);
const selectedPost = ref(null);

const searchPosts = async (e) => {
  const response = await threadboardApi.searchThreadBoards(e);

  console.log("검색어:", response.data.data);
  try {
    if (response.data.result === "success") {
      posts.value = response.data.data.map(p => ({
        ...p,
        showComments: false,
      }));
    } else {
      alert("검색 실패" + response.data.message);
      return;
    }
  } catch (error) {
    console.error("검색 중 오류 발생:", error);
  }
};

const editPost = (post) => {
  selectedPost.value = { ...post }; // 선택한 게시글 복사
  showEditModal.value = true; // 모달 열기
}

const onPostUpdated = (updatedPost) => {
  const index = posts.value.findIndex(p => p.tbNo === updatedPost.tbNo);
  if (index !== -1) {
    posts.value[index].tbTitle = updatedPost.tbTitle;
    posts.value[index].tbContent = updatedPost.tbContent;
  }
};

const posts = ref([]);
const loading = ref(false);
const keyword = ref("");
const newComment = ref("");
const showForm = ref(false);
const store = useStore();

const userProfile = computed(() =>
  store.getters["member/getMPicture"]
    ? `data:image/png;base64,${store.getters["member/getMPicture"]}`
    : "/default-profile.png"
);

const loadPosts = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const res = await threadboardApi.getThreadBoardList();
    posts.value = res.data.data.map(p => ({
      ...p,
      showComments: false,
    }));
  } catch (error) {
    console.log("게시글 로드 실패:", error);
  } finally {
    loading.value = false;
  }
};

// 🔹 삭제 버튼 클릭
const deletePost = async (post) => {
  if (!confirm("정말 삭제하시겠습니까?")) return;
  try {
    const res = await threadboardApi.deleteThreadBoard(post.tbNo);
    console.log("삭제 성공:", res.data);
    posts.value = posts.value.filter(p => p.tbNo !== post.tbNo);
  } catch (err) {
    console.error("삭제 실패:", err);
  }
};

const toggleLike = (post) => {
  post.tbLikeCount += post.liked ? -1 : 1;
  post.liked = !post.liked;
};

const toggleComments = (post) => {
  post.showComments = !post.showComments;
};

const toggleReplyLike = (reply) => {
  reply.liked = !reply.liked;
  reply.likeCount = reply.liked ? (reply.likeCount || 0) + 1 : (reply.likeCount || 1) - 1;
};

const addComment = async (post) => {
  if (!newComment.value.trim()) return;
  const memberNo = store.getters["member/getMNo"];

  const boardReplyReq = {
    brThreadBoardNo: post.tbNo,
    brMemberNo: memberNo,
    brContent: newComment.value
  };

  try {
    const res = await threadboardApi.insertBoardReply(boardReplyReq);
    console.log("댓글 등록 성공:", res.data);

    post.boardReplys.push({
      brNo: Date.now(),
      brMemberNo: memberNo,
      memberName: store.getters["member/getMName"],
      memberPicture: store.getters["member/getMPicture"],
      brContent: newComment.value,
      createdAt: new Date()
    });

    newComment.value = "";
  } catch (error) {
    console.error("댓글 등록 실패:", error);
  }
};

const editReply = async (post, reply) => {
  const newContent = prompt("댓글 내용을 수정하세요:", reply.brContent);
  if (newContent && newContent.trim() !== "") {
    reply.brContent = newContent.trim();
    // 예: await threadboardApi.updateBoardReply(reply);
  }
}

const deleteReply = async (post, reply) => {
  if (!confirm("댓글을 삭제하시겠습니까?")) return;
  try {
    const res = await threadboardApi.deleteBoardReply(reply.brNo);
    if (res.data.result === "success") {
      post.boardReplys = post.boardReplys.filter(r => r.brNo !== reply.brNo);
    } else {
      alert("댓글 삭제에 실패했습니다.");
    }
  } catch (err) {
    console.error("댓글 삭제 실패:", err);
  }
}

const highlightText = (text, keyword) => {
  if (!keyword) return text;
  const regex = new RegExp(`(${keyword})`, "gi");
  return text.replace(regex, match => `<mark>${match}</mark>`);
};

const saveReplyEdit = async (post, reply) => {
  const newContent = reply.tempContent?.trim();
  if (!newContent) { alert("댓글 내용을 입력해주세요."); return }

  try {
    const response = await threadboardApi.updateBoardReply({
      brNo: reply.brNo,
      brContent: newContent
    });
    console.log("response ", response.data);
    if (response.data.result === "success") {
      reply.brContent = newContent;
      reply.editing = false;
      alert("댓글 수정성공.");
    } else {
      alert("댓글 수정에 실패했습니다.");
    }
  } catch (err) {
    console.error("댓글 수정 실패:", err);
    return;
  }
}

const cancelReplyEdit = (reply) => {
  reply.editing = false;
  reply.tempContent = reply.brContent;
}

// 🔹 시간 경과 계산 (예: '2시간 전', '3일 전')
const timeAgo = (date) => {
  if (!date) return "";
  const now = new Date();
  const created = new Date(date);
  const diffSec = Math.floor((now - created) / 1000);

  if (diffSec < 60) return "방금 전";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay}일 전`;
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth}개월 전`;
  const diffYear = Math.floor(diffMonth / 12);
  return `${diffYear}년 전`;
};

onMounted(loadPosts);

</script>
<style scoped>
/* ===============================
   ✨ Threads 게시판 CSS (테마 연동형)
   =============================== */

/* 전체 스크롤 영역 */
.scroll-box {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 10px;
}

/* ====== 카드 ====== */
.card {
  background-color: var(--color-bg-card) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
  color: var(--color-text) !important;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* 본문 제목 */
.post-title {
  font-size: 1.15em;
  font-weight: 600;
  color: var(--color-text) !important;
  margin-bottom: 5px;
}

/* 본문 내용 */
.post-content {
  font-size: 1em;
  line-height: 1.5;
  color: var(--color-text-muted) !important;
  margin-bottom: 8px;
}

/* 작성자 정보 */
.fw-bold {
  color: var(--color-text) !important;
  font-weight: 600;
}

.text-muted {
  color: var(--color-text-muted) !important;
  font-size: 0.9em;
}

/* ====== 댓글 ====== */
.comment-item {
  background-color: var(--color-bg-hover) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: 10px;
  padding: 8px 12px;
  transition: background-color 0.2s ease;
}

.comment-item:hover {
  background-color: var(--color-bg-card) !important;
}

.comment-item .fw-semibold {
  color: var(--color-text) !important;
}

.comment-item .text-muted {
  font-size: 0.75em !important;
  color: var(--color-text-muted) !important;
}

/* 댓글 내용 */
.comment-item .text-light {
  color: var(--color-text) !important;
  font-size: 0.9em;
  line-height: 1.5;
}

/* 댓글 입력창 */
.form-control-sm {
  font-size: 0.9em;
  background-color: var(--color-bg-card) !important;
  border: 1px solid var(--color-border) !important;
  color: var(--color-text) !important;
}

.form-control-sm::placeholder {
  color: var(--color-text-muted) !important;
}

mark {
  background: none !important; /* ✅ 배경 제거 */
  color: var(--color-accent);  /* ✅ 강조 색상 (테마 색과 어울리게) */
  font-weight: 700;            /* ✅ 굵게 */
  padding: 0;                  /* ✅ 여백 제거 */
  border-radius: 0;            /* ✅ 둥근 배경 제거 */
}

</style>
