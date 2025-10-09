<template>
  <div class="d-flex justify-content-center align-items-start min-vh-100">
    <div class="card shadow-sm p-4" style="width: 500px; border-radius: 12px;">
      <h4 class="text-center mb-4 fw-bold">회원가입</h4>

      <!-- 프로필 이미지 업로드 -->
      <div class="text-center mb-4">
        <div class="border rounded d-flex justify-content-center align-items-center mb-2" style="width:120px; height:120px; margin:0 auto; background:#f8f9fa;">
          <img v-if="preview" :src="preview" class="rounded-circle" style="width:100%; height:100%; object-fit:cover;" />
          <span v-else class="text-muted">Photo</span>
        </div>
        <label class="btn btn-outline-danger btn-sm mt-2">
          <i class="bi bi-upload me-1"></i> 사진 추가
          <input type="file" @change="handleFileUpload" accept="image/*" hidden />
        </label>
      </div>

      <!-- 입력 폼 -->
      <form @submit.prevent="handleSubmit">
        <!-- 아이디 -->
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="mid" v-model="member.mId" placeholder="아이디" />
          <label for="mid"><i class="bi bi-person me-2"></i>아이디</label>
        </div>

        <!-- 이름 -->
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="mname" v-model="member.mName" placeholder="이름" />
          <label for="mname"><i class="bi bi-person-badge me-2"></i>이름</label>
        </div>

        <!-- 주민번호 -->
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="mssn" v-model="member.mSsn" placeholder="주민번호" />
          <label for="mssn"><i class="bi bi-card-text me-2"></i>주민번호</label>
        </div>

        <!-- 나이 -->
        <div class="form-floating mb-3">
          <input type="number" class="form-control" id="mage" v-model="member.mAge" placeholder="나이" />
          <label for="mage"><i class="bi bi-calendar me-2"></i>나이</label>
        </div>

        <!-- 이메일 -->
        <div class="form-floating mb-3">
          <input type="email" class="form-control" id="memail" v-model="member.mEmail" placeholder="Email" />
          <label for="memail"><i class="bi bi-envelope me-2"></i>Email</label>
        </div>

        <!-- 성별 -->
        <div class="mb-3">
          <label class="form-label fw-bold d-block mb-2"><i class="bi bi-gender-ambiguous me-2"></i>성별</label>
          <div class="d-flex justify-content-between">
            <button type="button" class="btn w-50 me-2" :class="member.mGender === 'M' ? 'btn-danger' : 'btn-outline-secondary'" @click="member.mGender = 'M'">남자</button>
            <button type="button" class="btn w-50" :class="member.mGender === 'F' ? 'btn-danger' : 'btn-outline-secondary'" @click="member.mGender = 'F'">여자</button>
          </div>
        </div>

        <!-- 비밀번호 -->
        <div class="form-floating mb-3">
          <input type="password" class="form-control" id="mpassword" v-model="member.mPassword" placeholder="비밀번호" />
          <label for="mpassword"><i class="bi bi-lock me-2"></i>비밀번호</label>
        </div>

        <!-- 닉네임 -->
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="mnickname" v-model="member.mNickname" placeholder="닉네임" />
          <label for="mnickname"><i class="bi bi-person-circle me-2"></i>닉네임</label>
        </div>

        <!-- 전화번호 -->
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="mphone" v-model="member.mPhone" placeholder="전화번호" />
          <label for="mphone"><i class="bi bi-telephone me-2"></i>전화번호</label>
        </div>

        <!-- 지역 -->
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="mregion" v-model="member.mRegion" placeholder="지역" />
          <label for="mregion"><i class="bi bi-geo-alt me-2"></i>지역</label>
        </div>

        <!-- 자기소개 -->
        <div class="form-floating mb-3">
          <textarea class="form-control" id="mbio" v-model="member.mBio" placeholder="자기소개"></textarea>
          <label for="mbio"><i class="bi bi-chat-left-text me-2"></i>자기소개</label>
        </div>

        <!-- MBTI -->
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="mbti" v-model="member.mMbti" placeholder="MBTI" />
          <label for="mbti"><i class="bi bi-emoji-smile me-2"></i>MBTI</label>
        </div>

        <!-- 제출 버튼 -->
        <button type="submit" class="btn btn-danger w-100 py-2 fw-bold">
          가입하기
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import memberApi from "@/apis/memberApi";
import { ref } from "vue";
import { useRouter } from "vue-router";
// import { toRaw } from "vue";
import { useStore } from "vuex";

const store = useStore();

const router = useRouter();

const image = ref(null);

const preview = ref(null); // 미리보기 URL

const member = ref({
  mId: "user1",
  mPassword: "123456",
  mName: "사용자1",
  mSsn: "999999-191919",
  mAge: 30,
  mEmail: "www1@www.www",
  mGender: "",
  mPhone: "01012345678",
  mNickname: "손오공1",
  mRegion: "서울",
  mBio: "",
  mMbti: ""
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    image.value = file; // File 객체 그대로 저장
    preview.value = URL.createObjectURL(file);
  }
};

const handleSubmit = async () => {

  const formdata = new FormData();

  formdata.append("member", new Blob([JSON.stringify(member.value)], { type: "application/json" }));
  formdata.append("file", image.value);

  const response = await memberApi.memberCreate(formdata);

  if (response.data.result === "success") {
    alert("회원가입 성공" + response.data.message);

    const LoginResponse = await memberApi.memberLogin({
      mId: member.value.mId,
      mPassword: member.value.mPassword
    });

    if (LoginResponse.data.result === "success") {
      alert(LoginResponse.data.message);
      console.log(LoginResponse.data);

      const mNo = LoginResponse.data.data.mNo;

      // dispatch login vuex에 로그인 정보 저장
      store.dispatch("member/saveAuth", {        
        ...LoginResponse.data.data,
        jwt: LoginResponse.data.jwt,
      });

      // dispatch Login Photo vuex에 로그인 정보 저장
      const photoRes = await memberApi.memberPictureGet(mNo);

      if (photoRes.data) {
        store.dispatch("member/savePhoto", {
          mAttachData: photoRes.data.data.mpAttachData
        });
        alert("나의 성향을 선택해주세요")
        router.push("/Member/CategorySurvey/Preference")
      }
    }
    else {
      console.log(LoginResponse.data.message);
    }
  }
  else {
    alert("회원가입 실패" + response.data.message);
  }

  // const response = await memberApi.memberInsert(member.value);
  // const formdata = new FormData();
  // formdata.append("", member.value.m_)

  // const responsepicture = await memberApi.memberInsertPicture(image);
  // if (response.data.result === "success") {
  //   alert("사진 등록 성공");
  // }
  // else {
  //   alert("사진 등록 실패" + response.data.message);
  // }
};
</script>
