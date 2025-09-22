<template>
  <div>
    <div class="banner">
      <div class="banner-left">
        <div>
          <h2>My Feed</h2>
          <small class="text-muted">Manage your posts and profile</small>
        </div>
      </div>

      <div class="category-tabs">
        <button class="btn btn-light">All</button>
        <button class="btn btn-light">Following</button>
        <button class="btn btn-light">Nearby</button>
        <button class="btn btn-light">Popular</button>
      </div>
    </div>

    <div>
      <div v-for="post in posts" :key="post.id" class="feed-card">
        <div class="feed-header">
          <img :src="post.userAvatar" alt="avatar"/>
          <div style="flex:1">
            <div class="fw-bold">{{ post.user }}</div>
            <small class="text-muted">{{ post.time }}</small>
          </div>
          <div class="text-muted"> <i class="bi bi-three-dots"></i> </div>
        </div>

        <img :src="post.image" class="feed-image" @click="openModal(post)" />

        <div class="feed-actions">
          <div>
            <button class="btn btn-light btn-sm me-2"><i class="bi bi-heart"></i></button>
            <button class="btn btn-light btn-sm me-2"><i class="bi bi-chat"></i></button>
            <button class="btn btn-light btn-sm"><i class="bi bi-upload"></i></button>
          </div>
        </div>

        <div class="feed-stats">
          <div class="mb-2"><strong>{{ post.likes }}</strong> likes</div>
          <div><strong>{{ post.user }}</strong> {{ post.caption }}</div>
          <div class="text-muted mt-2"><a href="#" class="text-muted">View all {{ post.comments }} comments</a></div>
        </div>
      </div>
    </div>

    <div class="modal fade" tabindex="-1" :class="{show: showModal}" style="display:block" v-if="showModal">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content" style="border-radius:12px;">
          <div class="modal-body p-0 d-flex">
            <div style="flex:1">
              <img :src="modalPost.image" style="width:100%; height:80vh; object-fit:cover;" />
            </div>
            <div style="width:420px; background:#fff; padding:20px;">
              <div class="d-flex align-items-center mb-3">
                <img :src="modalPost.userAvatar" class="rounded-circle me-2" width="48" height="48"/>
                <div>
                  <div class="fw-bold">{{ modalPost.user }}</div>
                  <small class="text-muted">{{ modalPost.time }}</small>
                </div>
                <button class="btn-close ms-auto" @click="closeModal()"></button>
              </div>
              <div>
                <div class="mb-3"><strong>{{ modalPost.likes }}</strong> likes</div>
                <div><strong>{{ modalPost.user }}</strong> {{ modalPost.caption }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);
const modalPost = ref({});
const posts = ref([
  {
    id:1, user:'Sarah', userAvatar:'https://i.pravatar.cc/56?u=21',
    time:'2 hours ago', image:'https://picsum.photos/1200/700?image=1069',
    likes:124, comments:23, caption:'Perfect day out with friends! 🌞 #lifestyle #friends'
  },
  {
    id:2, user:'Emily', userAvatar:'https://i.pravatar.cc/56?u=22',
    time:'4 hours ago', image:'https://picsum.photos/1200/700?image=1050',
    likes:89, comments:10, caption:'Lovely evening by the sea #sunset'
  },
  {
    id:3, user:'Marcus', userAvatar:'https://i.pravatar.cc/56?u=23',
    time:'1 day ago', image:'https://picsum.photos/1200/700?image=1027',
    likes:58, comments:5, caption:'New studio shots'
  }
]);

function openModal(post){
  modalPost.value = post;
  showModal.value = true;
  document.body.style.overflow='hidden';
}

function closeModal(){
  showModal.value = false;
  modalPost.value = {};
  document.body.style.overflow='auto';
}
</script>

<style scoped>
.modal { background: rgba(10,10,10,0.6); }
</style>
