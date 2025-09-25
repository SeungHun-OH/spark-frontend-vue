<template>
  <div class="container py-4">

    <!-- 상단 헤더 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold">My Preferences</h3>
    </div>

    <!-- 탭 네비게이션 -->
    <ul class="nav nav-pills nav-justified mb-4">
      <li class="nav-item" v-for="type in uniqueTypes" :key="type">
        <button class="nav-link" :class="{ active: activeTab === type }" @click="activeTab = type">
          {{ type }}
        </button>
      </li>
    </ul>

    <!-- 카드들 -->
    <div v-for="type in uniqueTypes" :key="type" v-show="activeTab === type">
      <Hobbies :type="type" />
    </div>

    <!-- 저장 버튼 -->
    <div class="d-flex justify-content-between mt-4">
      <button class="btn btn-outline-secondary">Cancel</button>
      <button class="btn btn-outline-secondary" @click="getAllcategoryStatic()">카테고리불러오기</button>
      <button class="btn btn-dark" @click="insertMemberCategories()">Save Preferences</button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import Hobbies from "./Hobbies.vue";
import memberCategoryApi from "@/apis/memberCategoryApi";

const store = useStore();
const uniqueTypes = computed(() => store.getters["memberCategory/getUniqueTypes"]);
const activeTab = ref("");

// 첫 번째 탭 자동 선택
if (uniqueTypes.value.length > 0) {
  activeTab.value = uniqueTypes.value[0];
}

async function insertMemberCategories() {
  const request = {
    member_No: store.getters["member/getM_no"],
    preferNos: store.getters["memberCategory/getselectcategories"]
  };
  console.log("저장 요청:", request);
}

async function getAllcategoryStatic() {
  const response = await memberCategoryApi.getAllcategoryStatic();
  console.log(response.data);
  store.commit("memberCategory/setCategories", response.data);
}

</script>




<!-- <template>
  <div class="container py-4">

    상단 헤더
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold">My Preferences</h3>
      <button class="btn btn-dark">
        <i class="bi bi-save me-1"></i> Save
      </button>
    </div>

    탭 네비게이션
    <ul class="nav nav-pills nav-justified mb-4">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'hobbies' }" @click="activeTab = 'hobbies'">
          Hobbies
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'mbti' }" @click="activeTab = 'mbti'">
          MBTI
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'ideal' }" @click="activeTab = 'ideal'">
          Ideal Type
        </button>
      </li>
    </ul>

    카드들
    <div v-if="activeTab === 'hobbies'">
      <Hobbies />
    </div>
    <div v-else-if="activeTab === 'mbti'">
      <Mbti />
    </div>
    <div v-else>
      <IdealType />
    </div>

    저장 버튼
    <div class="d-flex justify-content-between mt-4">
      <button class="btn btn-outline-secondary">Cancel</button>
      <button class="btn btn-outline-secondary" @click="getAllcategoryStatic()">카테고라 가져오기</button>
      <button class="btn btn-dark" @click="insertMemberCategories()">Save Preferences</button>
    </div>

    오른쪽 네비 버튼
    <div class="d-flex justify-content-end mt-3">
      <button class="btn btn-outline-dark rounded-circle">
        <i class="bi bi-arrow-right"></i>
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import Hobbies from "./Hobbies.vue";
import IdealType from "./IdealType.vue";
import Mbti from "./Mbti.vue";
import memberCategoryApi from "@/apis/memberCategoryApi";
import { useStore } from "vuex";

const store = useStore();

async function getAllcategoryStatic() {
  const response = await memberCategoryApi.getAllcategoryStatic();
  console.log(response.data);
  store.commit("memberCategory/setCategories", response.data);
}

async function insertMemberCategories() {
  
  const request = {
    member_No : store.getters["member/getM_no"],
    preferNos : store.getters["memberCategory/getselectcategories"]
  };

  if(request.member_No == null){
    alert("로그인이 안되어 있습니다");
  }
  else if(request.preferNos == null){
    alert("선택된 카테고리가 없습니다")
  }
  else{
    const response = await memberCategoryApi.insertMemberCategories(request);
  }  
}

const activeTab = ref("hobbies");
</script>

 -->
