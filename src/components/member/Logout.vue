<template>
  <div class = "d-flex align-itmes-center">
    <button v-if = "isLogin"
     class = "btn btn-sm btn-danger mt-3 w-100" @click ="logOut()"> logOut
    </button>

    <button v-else 
     class = "btn btn-sm btn-danger mt-3 w-100" @click ="logIn()"> logIn
    </button>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();

const isLogin = computed(() => {
  return store.getters["member/getJwt"];
});

const router = useRouter();

function logOut()
{
  alert("로그아웃");
  store.dispatch("member/logOut");
}

function logIn(){
  router.push("/Member/Login")

}

</script>