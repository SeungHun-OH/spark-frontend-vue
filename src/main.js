import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './assets/styles.css';
import axios from 'axios';
import memberApi from './apis/memberApi';



createApp(App).use(store).use(router).mount('#app')
store.dispatch("member/loadAuth");

const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  console.log("✅ JWT 복원 완료:", token);
  (async()=>{
    console.log("여기 실행");
    const response = await memberApi.getMemberInfoByToken();
    console.log(response.data.data.uuid);
    store.commit('auth/setMemberUuid', response.data.data.uuid);
  })();
} else {
  console.log("ℹ️ 저장된 JWT 없음");
}


 // (async () => {
  //   try {
  //     const response = await memberApi.memberGet(localStorage.getItem("mId"));
  //     const member = response.data.data; // 서버에서 반환된 Member DTO
  //     console.log("새로고침후 데이터는?" + response.data);

  //     // ✅ Vuex에 저장
  //     store.commit("member/setMemberOnly", member);

  //     // ✅ 프로필 이미지(base64) 있으면 저장
  //     if (member.mAttachData) {
  //       store.commit("member/setMAttachData", member.mAttachData);
  //       localStorage.setItem("mAttachData", member.mAttachData);
  //     }
  //     console.log("👤 내 회원정보 복원 완료:", member.mName);
  //   } catch (err) {
  //     console.error("❌ 회원정보 불러오기 실패:", err);
  //   }
  // })();
