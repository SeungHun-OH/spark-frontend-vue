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
        <input v-model="keyword" type="text" placeholder="검색어 입력..." class="form-control" @keyup.enter="searchPosts" />
      </div>

      <!-- 스크롤 박스 -->
      <div class="scroll-box" @scroll="handleScroll">
        <div v-for="post in posts" :key="post.tbNo" class="card mb-3">
          <div class="card-body">

            <!-- 프로필 + 닉네임/아이디 + 시간 + 수정삭제버튼 -->
            <div class="d-flex justify-content-between align-items-start mb-2">
              <!-- 작성자 프로필 -->
              <div class="d-flex align-items-center">
                <img :src="post.memberPicture ? `data:image/png;base64,${post.memberPicture}` : '/default-profile.png'" alt="프로필" class="post-thumbnail rounded-circle me-2" width="40" height="40" />
                <div>
                  <span class="fw-bold">{{ post.memberName }}</span>
                  <span class="text-muted"> | {{ post.memberId }}</span>
                  <small class="text-muted ms-2">· {{ timeAgo(post.createdAt) }}</small>
                </div>
              </div>

              <!-- 🔹 로그인한 유저 == 글쓴이일 때만 수정/삭제 버튼 -->
              <div v-if="isMyPost(post)">
                <button class="btn btn-outline-secondary btn-sm me-2" @click="editPost(post)">
                  ✏️ 수정
                </button>
                <button class="btn btn-outline-danger btn-sm" @click="deletePost(post)">
                  🗑 삭제
                </button>
              </div>
            </div>

            <!-- 제목 -->
            <p class="post-title mb-1">{{ post.tbTitle }}</p>

            <!-- 내용 -->
            <p class="post-content mb-2">{{ post.tbContent }}</p>

            <!-- 좋아요 / 댓글 -->
            <div v-if="post.tbMemberNo === store.getters['member/getMNo']">
              <button class="btn btn-outline-secondary btn-sm me-2" @click="editPost(post)">✏️ 수정</button>
              <button class="btn btn-outline-danger btn-sm" @click="deletePost(post)">🗑 삭제</button>
            </div>

            <!-- 🔹 댓글 영역 -->
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
                  </div>
                  <div class="text-light mt-1 small" style="white-space: pre-line;">
                    {{ reply.brContent }}
                  </div>
                </div>
              </div>

              <!-- 댓글 입력 -->
              <div class="mt-2 d-flex align-items-center">
                <img :src="userProfile" class="rounded-circle me-2" width="35" height="35" />
                <input v-model="newComment" type="text" class="form-control form-control-sm rounded-pill bg-dark text-light border-secondary" placeholder="댓글 달기..." @keyup.enter="addComment(post)" />
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
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import ThreadPost from "@/components/Thread/ThreadPost.vue";
import threadboardApi from "@/apis/threadboardApi";
import { useStore } from "vuex";

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

// 🔹 내 게시글인지 판별하는 함수
const isMyPost = (post) => {
  const myNo = store.getters["member/getMNo"];
  return post.tbMemberNo === myNo;
};

// 🔹 수정 버튼 클릭
const editPost = (post) => {
  const newContent = prompt("게시글 내용을 수정하세요:", post.tbContent);
  if (newContent && newContent.trim() !== "") {
    post.tbContent = newContent;
    // 백엔드 연동 (예: threadboardApi.updateBoard(post))
    console.log("게시글 수정 요청:", post);
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
   🌙 Threads 스타일 게시판 CSS
   =============================== */

/* 전체 스크롤 영역 */
.scroll-box {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 10px;
}

/* ====== 본문 ====== */
.card {
  background-color: #181818;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

/* 본문 제목 */
.post-title {
  font-size: 1.15em;
  font-weight: 600;
  color: #f5f5f5;
  /* 좀 더 밝게 */
  margin-bottom: 5px;
}

/* 본문 내용 */
.post-content {
  font-size: 1em;
  line-height: 1.5;
  color: #ddd;
  /* 본문은 밝은 회색 */
  margin-bottom: 8px;
}

/* 작성자 정보 */
.fw-bold {
  color: #fff;
  font-weight: 600;
}

.text-muted {
  color: #999 !important;
  font-size: 0.9em;
}

/* ====== 댓글 ====== */
.comment-item {
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  padding: 8px 12px;
  transition: background-color 0.2s ease;
}

.comment-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

/* 댓글 작성자 */
.comment-item .fw-semibold {
  color: #e8e8e8;
  font-size: 0.92em;
  font-weight: 500;
}

/* 댓글 시간 */
.comment-item .text-muted {
  font-size: 0.75em !important;
  color: #aaa !important;
}

/* 댓글 내용 */
.comment-item .text-light {
  color: #ccc !important;
  font-size: 0.9em;
  line-height: 1.5;
}

/* 댓글 ‘답글 달기’ 버튼 */
.reply-btn {
  font-size: 0.8em;
  color: #999;
  transition: color 0.2s;
}

.reply-btn:hover {
  color: #fff;
  text-decoration: underline;
}

/* 좋아요 하트 버튼 */
.like-btn {
  border: none;
  background: none;
  cursor: pointer;
  color: #999;
}

.like-btn:hover {
  color: #ff4d4d;
}

/* 댓글 입력창 */
.form-control-sm {
  font-size: 0.9em;
  background-color: #202020 !important;
  border: 1px solid #333 !important;
  color: #eee !important;
}

.form-control-sm::placeholder {
  color: #888 !important;
}

/* 댓글 프로필 */
.comment-item img {
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>



<!-- const loadPosts = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const res = await threadboardApi.getThreadBoardList();

    console.log("API 응답:", res.data);

    const newPosts = res.data.data.map(b => ({
      boardNo : b.tbNo,
      id: b.memberId,
      author: { nickname: b.memberName + b.tbMemberNo, profileImg: b.memberPicture ? `data:image/png;base64,${b.memberPicture}` : null},
      date: b.createdAt,
      title: b.tbTitle,
      content: b.tbContent,
      image: b.tbImageNo ? `/images/${b.tbImageNo}` : null,
      likes: b.tbLikeCount,
      liked: false,
      comments: []
    }));

    if (newPosts.length > 0) {
      posts.value.push(...newPosts);
      page.value++;
    }

  } catch (err) {
    console.error("게시글 로드 실패:", err);
  } finally {
    loading.value = false;
  }
}; -->







<!-- const loadPosts = async () => {
  if (loading.value) return;
  loading.value = true;
  const newPosts = await mockFetch(page.value, size.value, keyword.value);
  if (newPosts.length > 0) {
    posts.value.push(...newPosts);
    page.value++;
  }
  loading.value = false;
  console.log("loadPosts function called");
}; -->



<!-- <template>
  <div class="d-flex">

    <div class="flex-grow-1 container py-3">

      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>🌱 Writing App (Community)</h4>
        <button class="btn btn-primary btn-sm" @click="showForm = !showForm">✍️ 글쓰기</button>
      </div>

      <ThreadPost :show="showForm" @post-added="addPost" @close="showForm = false" />

      <div class="mb-3">
        <input v-model="keyword" type="text" placeholder="검색어 입력..." class="form-control" @keyup.enter="searchPosts" />
      </div>

      <div class="scroll-box" @scroll="handleScroll">
        <div v-for="post in posts" :key="post.id" class="card mb-3">
          <div class="card-body">
            <div class="d-flex align-items-center mb-2">
              <img :src="post.author.profileImg" class="rounded-circle me-2" width="40" height="40" />
              <span class="fw-bold">{{ post.author.nickname }}</span>
            </div>
            <p>{{ post.content }}</p>
            <img v-if="post.image" :src="post.image" class="img-fluid rounded mb-2" />

            <div class="d-flex justify-content-between">
              <button class="btn btn-sm btn-outline-danger" @click="toggleLike(post)">❤️ {{ post.likes }}</button>
              <button class="btn btn-sm btn-outline-secondary" @click="toggleComments(post)">💬 {{ post.comments.length }}</button>
            </div>

            <div v-if="post.showComments" class="mt-2">
              <div v-for="c in post.comments" :key="c.id" class="border rounded p-2 mb-1">
                <b>{{ c.author }}</b> {{ c.content }}
              </div>
              <input v-model="newComment" type="text" class="form-control form-control-sm" placeholder="댓글 달기..." @keyup.enter="addComment(post)" />
            </div>
          </div>
        </div>

        <div v-if="loading" class="text-center py-3">
          <div class="spinner-border"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ThreadMenu from "@/components/Thread/ThreadMenu.vue";
import ThreadPost from "@/components/Thread/ThreadPost.vue";

const posts = ref([]);
const page = ref(0);
const size = ref(5);
const loading = ref(false);
const keyword = ref("");
const newComment = ref("");
const showForm = ref(false);

const loadPosts = async () => {
  if (loading.value) return;
  loading.value = true;
  const newPosts = await mockFetch(page.value, size.value, keyword.value);
  if (newPosts.length > 0) {
    posts.value.push(...newPosts);
    page.value++;
  }
  loading.value = false;
};

const searchPosts = async () => {
  page.value = 0;
  posts.value = [];
  await loadPosts();
};

const handleScroll = (e) => {
  const el = e.target;
  const bottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
  if (bottom) {
    loadPosts();
  }
};

const toggleLike = (post) => {
  post.likes += post.liked ? -1 : 1;
  post.liked = !post.liked;
};

const toggleComments = (post) => {
  post.showComments = !post.showComments;
};

const addComment = (post) => {
  if (newComment.value.trim() !== "") {
    post.comments.push({ id: Date.now(), author: "Me", content: newComment.value });
    newComment.value = "";
  }
};

const addPost = (newPost) => {
  posts.value.unshift(newPost);
  showForm.value = false;
};

const mockFetch = async (page, size, keyword) => {
  const dummy = [];
  for (let i = 1; i <= 100; i++) {
    dummy.push({
      id: i,
      author: { nickname: "User" + i, profileImg: "https://via.placeholder.com/40" },
      content: `테스트 글 ${i}번 - 무한 스크롤 확인용 📜`,
      image: i % 4 === 0 ? "https://via.placeholder.com/400x200" : null,
      likes: Math.floor(Math.random() * 50),
      liked: false,
      comments: []
    });
  }
  let filtered = dummy.filter((p) => p.content.includes(keyword));
  const start = page * size;
  const end = start + size;
  return new Promise((resolve) => setTimeout(() => resolve(filtered.slice(start, end)), 500));
};

onMounted(() => {
  loadPosts();
});
</script>

<style scoped>
.scroll-box {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 10px;
}
</style>


 -->
