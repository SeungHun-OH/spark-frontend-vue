<template>
  <div>
    <div class="card">
      <div class="card-header">
        Example
        <div>
          <router-link to="/Member/CategorySurvey/Preference"> 나의 선호도 조사 </router-link>
        </div>
        <div>
          <router-link to="/Member/CategorySurvey/PartnerPreference"> 파트너 선호도 조사 </router-link>
        </div>
        <div>
          <router-link to="/Thread/ThreadMain"> 파트너 선호도 조사 </router-link>
        </div>
        <div>
          <button class = "btn btn-info btn-sm" @click = "jwtTest()"> Jwt 테스트 </button>
        </div>
      </div>

      <div class="card-body">

      </div>

    </div>
  </div>
</template>

<script setup>
import memberApi from '@/apis/memberApi';
import { useStore } from 'vuex';

const store = useStore();

async function jwtTest() {

  const jwt = store.getters["member,getJwt"] || localStorage.getItem("jwt");
  const response = await memberApi.memberGetJwt(jwt);

  console.log("Api 로그인 JWt message" + response.data.message);
  console.log("Api 로그인 JWt Data" + JSON.stringify(response.data.data));
  console.log("Api 로그인 JWt Mno" + JSON.stringify(response.data.data.mno));
  // console.log("Api 로그인 JWt mNo" + response.data.mNo);

  // memberApi.memberLogin
}

</script>

<style scoped></style>


<!-- <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/Member/Login">Login</router-link> |
      <router-link to="/Member/Sign">Sign</router-link> |
    </nav>


<div class="content-wrap d-flex">
      <Sidebar />
      <main class="content flex-grow-1">
        <router-view />
      </main>
    </div> -->