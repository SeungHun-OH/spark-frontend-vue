<template>
  <div class="container py-4">
    <h4 class="mb-1">My Profile</h4>
    <p class="text-muted">Manage your dating profile</p>

    <div class="row">
      <!-- 왼쪽 메인 영역 -->
      <div class="col-md-8">

        <!-- 사진 카드 -->
        <BaseCard>
          <div class="text-center">
            <img :src="picture" alt="profile" class="rounded img-fluid mb-2" style="max-height: 250px; object-fit: cover;" />
            <button class="btn btn-outline-secondary btn-sm">
              <i class="bi bi-camera"></i> Add Photo
            </button>
          </div>
        </BaseCard>

        <!-- 기본 정보 카드 -->
        <BaseCard>
          <div class="d-flex justify-content-between">
            <h6 class="fw-bold">Basic Info</h6>
            <i class="bi bi-pencil-square cursor-pointer" @click="toggleEdit('basic')"></i>
          </div>

          <!-- 보기 모드 -->
          <div v-if="!editState.basic">
            <p class="mb-0 fw-bold">{{ store.getters["member/getMName"] }} {{ store.getters["member/getMAge"] }}</p>
            <p class="text-muted mb-1"><i class="bi bi-geo-alt"></i> {{ store.getters["member/getMRegion"] }}</p>
            <p class="text-muted mb-1"><i class="bi bi-briefcase"></i> {{ store.getters["member/getMEmail"] }}</p>
          </div>

          <!-- 수정 모드 -->
          <div v-else>
            <input v-model="memberEdit.mName" class="form-control mb-2" placeholder="이름" />
            <input v-model="memberEdit.mAge" class="form-control mb-2" placeholder="나이" />
            <input v-model="memberEdit.mRegion" class="form-control mb-2" placeholder="지역" />
            <input v-model="memberEdit.mEmail" class="form-control mb-2" placeholder="이메일" />

            <button class="btn btn-primary btn-sm" @click="saveChange('basic')">저장</button>
            <button class="btn btn-secondary btn-sm ms-1" @click="cancelEdit('basic')">취소</button>
          </div>
        </BaseCard>

        <!-- 자기소개 카드 -->

        <BaseCard>
          <div class="d-flex justify-content-between">
            <h6 class="fw-bold">About Me</h6>
            <i class="bi bi-pencil-square cursor-pointer" @click="toggleEdit('about')"></i>
          </div>

          <!-- 보기 모드 -->
          <div v-if="!editState.about">
            <p class="text-muted mb-0">{{ store.getters["member/getMBio"] }}</p>
          </div>

          <!-- 수정 모드 -->
          <div v-else>
            <textarea v-model="memberEdit.mBio" class="form-control mb-2" rows="4" placeholder="자기소개를 입력하세요"></textarea>

            <button class="btn btn-primary btn-sm" @click="saveChange('about')">저장</button>
            <button class="btn btn-secondary btn-sm ms-1" @click="cancelEdit('about')">취소</button>
          </div>
        </BaseCard>


      </div>

      <!-- 오른쪽 사이드 -->
      <div class="col-md-4">

        <!-- 관심사 -->
        <BaseCard>
          <div class="d-flex justify-content-between">
            <h6 class="fw-bold">MyPreference</h6>
            <i class="bi bi-pencil-square cursor-pointer"></i>
          </div>
          <div>
            <span v-for="(hobby, index) in profile.interests" :key="index" class="badge bg-light text-dark me-1 mb-1">
              {{ hobby }}
            </span>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="d-flex justify-content-between">
            <h6 class="fw-bold">PartnerPreference</h6>
            <i class="bi bi-pencil-square cursor-pointer"></i>
          </div>
          <div>
            <span v-for="(hobby, index) in profile.preferences" :key="index" class="badge bg-light text-dark me-1 mb-1">
              {{ hobby }}
            </span>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="d-flex justify-content-between">
            <h6 class="fw-bold">MatchedPreferences</h6>
            <i class="bi bi-pencil-square cursor-pointer"></i>
          </div>
          <div>
            <span v-for="(hobby, index) in profile.MatchedPreferences" :key="index" class="badge bg-light text-dark me-1 mb-1">
              {{ hobby }}
            </span>
          </div>
        </BaseCard>


        <!-- 선호조건 -->
        <BaseCard>
          <div class="d-flex justify-content-between">
            <h6 class="fw-bold">Dating Preferences</h6>
            <i class="bi bi-pencil-square cursor-pointer"></i>
          </div>
          <!-- <p class="mb-1">Age Range: {{ profile.preferences.ageRange }}</p>
          <p class="mb-1">Maximum Distance: {{ profile.preferences.distance }}</p>
          <p class="mb-0">Looking For: <span class="fw-bold">{{ profile.preferences.lookingFor }}</span></p> -->
        </BaseCard>

        <!-- 계정 설정 -->
        <BaseCard>
          <h6 class="fw-bold">Account Settings</h6>
          <button class="btn btn-light w-100 mb-2 text-start">
            <i class="bi bi-shield-lock"></i> Privacy Settings
          </button>
          <button class="btn btn-light w-100 mb-2 text-start">
            <i class="bi bi-bell"></i> Notification Preferences
          </button>
          <button class="btn btn-outline-danger w-100 text-start">
            <i class="bi bi-trash"></i> Delete Account
          </button>
        </BaseCard>

      </div>
    </div>
  </div>
</template>

<script setup>

import memberApi from '@/apis/memberApi';
import memberCategoryApi from '@/apis/memberCategoryApi';
import BaseCard from '@/components/member/BaseCard.vue';
import member from '@/store/member';
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const editState = ref({
  basic: false,
  about: false,
});

const memberEdit = ref({ ...store.getters["member/getMember"] })

function toggleEdit(section) {
  editState.value[section] = true
}

function cancelEdit(section) {
  editState.value[section] = false;
}

async function saveChange() {
  try {

    store.commit("member/setMember", memberEdit.value);

    //커밋후에 지워서 보내기
    delete memberEdit.value.jwt;
    delete memberEdit.value.mAttachData;

    editState.value.basic = false

    console.log("업데이트 세이브 체인지 수정된후" + JSON.stringify(memberEdit.value));

    const response = await memberApi.memberUpdate(memberEdit.value);

    if (response.data.result == "success") {
      alert("업데이트 성공" + response.data.message);
    }
    else {
      alert("업데이트 실패" + response.data.message);
    }
  } catch (error) {
    alert("업데이트 실패[서버]" + error);
  }
}

const picture = computed(() => {
  const data = store.getters["member/getMAttachData"];
  return data ? `data:image/png;base64,${data}` : null;
});

const profile = ref({
  photo: "https://via.placeholder.com/400x300",
  name: "Alex Johnson",
  age: 29,
  location: "San Francisco, CA",
  job: "Senior Software Engineer at TechCorp",
  education: "Computer Science, Stanford University",
  about: "Software engineer who loves cooking, traveling, and meeting new people. Always up for trying new restaurants or exploring hidden gems in the city!",
  interests: [],
  preferences: [],
  MatchedPreferences: []
})

onMounted(async () => {
  const mNo = store.getters["member/getMNo"];
  const res = await memberCategoryApi.getPreferenceByMemberNo(mNo);

  // console.log("CateRes무엇?", JSON.stringify(res.data.data));

  const resInterests = res.data.data.selfPrefers.map(item => item.pcName);
  const resPreferences = res.data.data.partnerPrefers.map(item => item.pcName);

  // profile.value.interests = resInterests;
  // profile.value.preferences = resPreferences;

  profile.value.MatchedPreferences = resInterests.filter(item => {
    return resPreferences.includes(item);
  });

  profile.value.interests = resInterests.filter(item => {
    return !resPreferences.includes(item);
  });

  profile.value.preferences = resPreferences.filter(item => {
    return !resInterests.includes(item);
  });


  // const common = profile.value.interests.filter(item =>{
  //   profile.value.preferences.includes(item);
  // });

  // const onlyInterests = profile.value.interests.filter(item => {
  //   !profile.value.preferences.includes(item);
  // });

  // const onlyPreferences = profile.value.preferences.filter(item => {
  //   !profile.value.interests.includes(item);
  // });
});


</script>
