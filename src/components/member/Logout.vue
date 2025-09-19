<template>
  <div class = "d-flex align-itmes-center">
    <button class = "btn btn-info btn-sm" @click ="logOut()"> logOut</button>
  </div>
</template>

<script>
import { useStore } from 'vuex';

const store = useStore();

function logOut()
{
  alert("로그아웃");
  store.dispatch("logOut");
}

</script>