<template>
  <div>
    <h3 class="mb-2">Hearts <small class="text-muted d-block">People who liked you</small></h3>

    <!-- toggle 50/50 full width -->
    <div class="hearts-toggle mb-3">
      <button :class="['btn', active==='matching' ? 'btn-primary' : 'btn-light']" @click="active='matching'">Matching Likes (8)</button>
      <button :class="['btn', active==='feed' ? 'btn-primary' : 'btn-light']" @click="active='feed'">Feed Likes (6)</button>
    </div>

    <div class="row g-3">
      <!--visibleUsers 배열을 반복 렌더링. u : 각 사용자, i는 index-->
      <div class="col-md-3" v-for="(u,i) in visibleUsers" :key="i">
        <div class="card position-relative" style="border-radius:12px; overflow:hidden;">
          <div class="heart-badge"><i class="bi bi-heart-fill text-danger"></i></div>
          <img :src="u.image" style="width:100%; height:200px; object-fit:cover;" />
          <div class="p-3">
            <div class="d-flex align-items-center">
              <img :src="u.avatar" class="rounded-circle me-2" width="44" height="44" />
              <div>
                <div class="fw-bold">{{u.name}} <small class="text-muted">{{u.age}}</small></div>
                <small class="text-muted">{{u.time}}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const active = ref('matching');
const matchingUsers = ref([
  {name:'Jordan',age:27,time:'1 hour ago', image:'https://picsum.photos/500/320?21', avatar:'https://i.pravatar.cc/44?u=21'},
  {name:'Alex',age:30,time:'3 hours ago', image:'https://picsum.photos/500/320?22', avatar:'https://i.pravatar.cc/44?u=22'},
  {name:'Ryan',age:29,time:'5 hours ago', image:'https://picsum.photos/500/320?23', avatar:'https://i.pravatar.cc/44?u=23'},
  {name:'Emma',age:28,time:'1 day ago', image:'https://picsum.photos/500/320?24', avatar:'https://i.pravatar.cc/44?u=24'}
]);
const feedUsers = ref([
  {name:'Isabella',age:25,time:'2 days ago', image:'https://picsum.photos/500/320?25', avatar:'https://i.pravatar.cc/44?u=25'},
  {name:'Marcus',age:32,time:'3 days ago', image:'https://picsum.photos/500/320?26', avatar:'https://i.pravatar.cc/44?u=26'},
  {name:'Sophia',age:26,time:'4 hours ago', image:'https://picsum.photos/500/320?27', avatar:'https://i.pravatar.cc/44?u=27'},
  {name:'Maya',age:24,time:'1 day ago', image:'https://picsum.photos/500/320?28', avatar:'https://i.pravatar.cc/44?u=28'}
]);
const visibleUsers = computed(() => active.value === 'matching' ? matchingUsers.value : feedUsers.value);
</script>
