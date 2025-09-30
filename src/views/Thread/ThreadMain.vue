<template>
  <div class="container py-3">

    <!-- 검색창 -->
    <div class="mb-3">
      <input
        v-model="keyword"
        type="text"
        placeholder="검색어 입력..."
        class="form-control"
        @keyup.enter="searchPosts"
      />
    </div>

    <!-- 게시글 카드 -->
    <div v-for="post in posts" :key="post.id" class="card mb-3">
      <div class="card-body">
        <!-- 작성자 -->
        <div class="d-flex align-items-center mb-2">
          <img :src="post.author.profileImg" class="rounded-circle me-2" width="40" height="40"/>
          <span class="fw-bold">{{ post.author.nickname }}</span>
        </div>

        <!-- 내용 -->
        <p>{{ post.content }}</p>

        <!-- 이미지 -->
        <img v-if="post.image" :src="post.image" class="img-fluid rounded mb-2"/>

        <!-- 액션 버튼 -->
        <div class="d-flex justify-content-between">
          <button class="btn btn-sm btn-outline-danger" @click="toggleLike(post)">
            ❤️ {{ post.likes }}
          </button>
          <button class="btn btn-sm btn-outline-secondary" @click="toggleComments(post)">
            💬 {{ post.comments.length }}
          </button>
        </div>

        <!-- 댓글 -->
        <div v-if="post.showComments" class="mt-2">
          <div v-for="c in post.comments" :key="c.id" class="border rounded p-2 mb-1">
            <b>{{ c.author }}</b> {{ c.content }}
          </div>

          <!-- 댓글 입력 -->
          <input v-model="newComment" type="text" class="form-control form-control-sm" placeholder="댓글 달기..."
                 @keyup.enter="addComment(post)"/>
        </div>
      </div>
    </div>

    <!-- 로딩 스피너 -->
    <div v-if="loading" class="text-center py-3">
      <div class="spinner-border"></div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      posts: [],       // 게시글 리스트
      page: 0,         // 현재 페이지
      size: 5,         // 한 번에 불러올 개수
      loading: false,
      keyword: "",
      newComment: ""
    }
  },
  mounted() {
    this.loadPosts();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    async loadPosts() {
      if (this.loading) return;
      this.loading = true;

      // 더미 API 호출
      const newPosts = await this.mockFetch(this.page, this.size, this.keyword);

      if (newPosts.length > 0) {
        this.posts.push(...newPosts);
        this.page++;
      }
      this.loading = false;
    },
    async searchPosts() {
      this.page = 0;
      this.posts = [];
      await this.loadPosts();
    },
    handleScroll() {
      const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (bottom) {
        this.loadPosts();
      }
    },
    toggleLike(post) {
      post.likes += post.liked ? -1 : 1;
      post.liked = !post.liked;
    },
    toggleComments(post) {
      post.showComments = !post.showComments;
    },
    addComment(post) {
      if (this.newComment.trim() !== "") {
        post.comments.push({ id: Date.now(), author: "Me", content: this.newComment });
        this.newComment = "";
      }
    },

    // 더미 데이터 API 시뮬레이션
    async mockFetch(page, size, keyword) {
      const dummy = [
        {
          id: 1, author: { nickname: "Alice", profileImg: "https://via.placeholder.com/40" },
          content: "오늘 날씨가 너무 좋아요 🌞",
          image: "https://via.placeholder.com/400x200",
          likes: 10, liked: false, comments: []
        },
        {
          id: 2, author: { nickname: "Bob", profileImg: "https://via.placeholder.com/40" },
          content: "커피 한잔 하고 싶다 ☕",
          image: null,
          likes: 3, liked: false, comments: []
        }
      ];

      // keyword 필터
      let filtered = dummy.filter(p => p.content.includes(keyword));
      return new Promise(resolve => setTimeout(() => {
        resolve(filtered.slice(page * size, (page + 1) * size));
      }, 500));
    }
  }
}
</script>

<style>
.card {
  border-radius: 12px;
}
</style>
