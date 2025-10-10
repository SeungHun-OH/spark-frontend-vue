import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './assets/styles.css';
import axios from 'axios';



createApp(App).use(store).use(router).mount('#app')
store.dispatch("member/loadAuth");

const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  console.log("✅ JWT 복원 완료:", token);
} else {
  console.log("ℹ️ 저장된 JWT 없음");
}
