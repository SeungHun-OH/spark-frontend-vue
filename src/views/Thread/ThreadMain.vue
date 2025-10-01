<template>
  <div class="d-flex">
    <div class="flex-grow-1 container py-3">

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
        <div v-for="post in posts" :key="post.id" class="card mb-3">
          <div class="card-body">
            <!-- 작성자 -->
            <div class="d-flex align-items-center mb-2">
              <img :src="post.author.profileImg" class="rounded-circle me-2" width="40" height="40" />
              <span class="fw-bold">{{ post.author.nickname }}</span>
              <small class="text-muted ms-2">• {{ timeAgo(post.date) }} ({{ formatDate(post.date) }})</small>
            </div>

            <!-- 글 내용 -->
            <p class="post-title">{{ post.title }}</p>
            <p class="post-content">{{ post.content }}</p>

            <img v-if="post.image" :src="post.image" class="img-fluid rounded mb-2" />

            <!-- 좋아요/댓글 -->
            <div class="d-flex justify-content-between">
              <button class="btn btn-sm btn-outline-danger" @click="toggleLike(post)">❤️ {{ post.likes }}</button>
              <button class="btn btn-sm btn-outline-secondary" @click="toggleComments(post)">💬 {{ post.comments.length }}</button>
            </div>

            <!-- 댓글 -->
            <div v-if="post.showComments" class="mt-2">
              <div v-for="c in post.comments" :key="c.id" class="border rounded p-2 mb-1">
                <b>{{ c.author }}</b> {{ c.content }}
              </div>
              <input v-model="newComment" type="text" class="form-control form-control-sm" placeholder="댓글 달기..." @keyup.enter="addComment(post)" />
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
import { ref, onMounted } from "vue";
import ThreadPost from "@/components/Thread/ThreadPost.vue";
import threadboardApi from "@/apis/threadboardApi";

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
  try {
    const res = await threadboardApi.getThreadBoardList();

    console.log("API 응답:", res.data);

    const newPosts = res.data.data.map(b => ({
      id: b.tbNo,
      author: { nickname: b.memberName + b.tbMemberNo, profileImg: "https://via.placeholder.com/40" },
      date: b.createdAt,
      title: b.tbTitle,
      content: b.tbContent,
      image: b.tbImageNo ? `/images/${b.tbImageNo}` : null,
      likes: b.tbLikeCount,
      liked: false,
      comments: []
    }));

    console.log("Fetched posts:", newPosts);

    if (newPosts.length > 0) {
      posts.value.push(...newPosts);
      page.value++;
    }

  } catch (err) {
    console.error("게시글 로드 실패:", err);
  } finally {
    loading.value = false;
  }
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

// ✅ 날짜 포맷 함수 (YYYY-MM-DD)
const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

// ✅ 상대시간 함수
const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 60) return "방금 전";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
};

const mockFetch = async (page, size, keyword) => {
  const dummy = [];
  const regions = ["서울", "부산", "대구", "인천", "광주", "대전"];

  for (let i = 1; i <= 100; i++) {
    dummy.push({
      id: i,
      author: { nickname: "User" + i, profileImg: "https://via.placeholder.com/40" },
      region: regions[i % regions.length],
      date: new Date(Date.now() - i * 86400000), // i일 전
      content: `테스트 글 ${i}번 - 무한 스크롤 확인용 📜`,
      image: i % 4 === 0 ? "https://via.placeholder.com/400x200" : null,
      likes: Math.floor(Math.random() * 50),
      liked: false,
      comments: []
    });
  }



  let filtered = dummy;
  if (keyword && keyword.trim() !== "") {
    filtered = dummy.filter((p) => p.content.includes(keyword) || p.author.nickname.includes(keyword));
  }

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

.post-box {
  margin-bottom: 20px; /* 박스 사이 간격 */
}

.post-title {
  font-size: 0.75em; 
  margin-bottom: 2px; 
  color: #555; 
}

.post-content {
  font-size: 1em; 
  margin: 0; 
  line-height: 1.4; 
}
</style>







  




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
