<template>
  <div>
    <h3 class="mb-3">Matching</h3>

    <div class="match-card" v-if="current">
      <div class="position-relative" ref="cardContainer" style="overflow:hidden;">
        <!-- card that will be draggable -->
        <div
          class="card-img-top"
          :style="cardStyle"
          @pointerdown="startDrag"
        >
          <img :src="current.image" style="width:100%; height:480px; object-fit:cover; display:block;" draggable="false" />
          <!-- small mutual badge if present -->
          <div style="position:absolute; left:12px; top:12px;">
            <span v-if="current.mutual" class="badge bg-success">Mutual ✨</span>
          </div>
          <!-- heart icon overlay top-right -->
          <div style="position:absolute; right:12px; top:12px;">
            <div class="badge bg-white text-danger"><i class="bi bi-heart-fill"></i></div>
          </div>
        </div>

        <!-- details -->
        <div style="padding:22px;">
          <div class="d-flex align-items-center">
            <div>
              <h4 class="mb-0">{{ current.name }} <small class="text-muted">{{ current.age }}</small></h4>
              <div class="text-muted"><i class="bi bi-geo-alt"></i> {{ current.location }}</div>
            </div>
          </div>
          <div class="mt-3">
            <div><i class="bi bi-briefcase me-2"></i>{{ current.job }}</div>
            <div class="text-muted"><i class="bi bi-mortarboard me-2"></i>{{ current.school }}</div>
          </div>
          <div class="mt-3">
            <span v-for="(t,i) in current.tags" :key="i" class="badge bg-light text-dark me-1">{{ t }}</span>
          </div>
          <div class="d-flex justify-content-center gap-3 mt-4">
            <button class="btn btn-light heart-btn" @click="swipeLeft"><i class="bi bi-x-lg fs-4"></i></button>
            <button class="btn btn-danger heart-btn" @click="swipeRight"><i class="bi bi-heart-fill fs-4"></i></button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="center" style="height:300px;">
      <div>No more profiles</div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';

const profiles = ref([
        { id:1, name:'Emma', age:28, location:'Downtown', job:'Graphic Designer', school:'Art Institute', tags:['Photography','Hiking','Coffee','+2'], image:'https://picsum.photos/900/480?image=100' , mutual:true},
        { id:2, name:'Jordan', age:27, location:'Uptown', job:'Engineer', school:'State Uni', tags:['Travel','Running'], image:'https://picsum.photos/900/480?image=200'},
        { id:3, name:'Maya', age:24, location:'Riverside', job:'Chef', school:'Culinary School', tags:['Food','Art'], image:'https://picsum.photos/900/480?image=300'}
      ]);
const index = ref(0);
const dragging = ref(false);
const startX = ref(0);
const currentX = ref(0);
const velocityX = ref(0);
const lastTime = ref(0);

const cardContainer = ref(null);

const current = computed(() => profiles.value[index.value] || null);

const cardStyle = computed(() => ({ transform: `translateX(${currentX.value}px)` }));

function startDrag(e) {
  const el = cardContainer.value;
  dragging.value = true;
  startX.value = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  lastTime.value = performance.now();
  el.setPointerCapture && el.setPointerCapture(e.pointerId);
  const move = (ev) => {
    const now = performance.now();
    const dx = (ev.clientX || 0) - startX.value;
    currentX.value = dx;
    const dt = now - lastTime.value;
    if (dt > 0) velocityX.value = (dx) / dt;
    lastTime.value = now;
  };
  const up = (ev) => {
    dragging.value = false;
    if (Math.abs(currentX.value) > 120 || Math.abs(velocityX.value) > 0.5) {
      // swipe away
      if (currentX.value < 0) index.value = Math.min(index.value + 1, profiles.value.length - 1);
      else index.value = Math.max(index.value - 1, 0);
      currentX.value = 0;
    } else {
      // bounce back
      currentX.value = 0;
    }
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerup', up);
    el.removeEventListener('pointercancel', up);
  };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
}

onMounted(()=>{ /* nothing additional for now */ });
</script>
<style scoped>
.card-img-top { cursor:grab; user-select:none; }
.card-img-top:active { cursor:grabbing; }
</style>