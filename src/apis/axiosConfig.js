import axios from "axios"

axios.defaults.baseURL = "http://localhost:8040";

// 로그인 성공 시
export function loginSuccess(token) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  localStorage.setItem("token", token);
  console.log("Axios 공통 헤더:", axios.defaults.headers.common);
}

// 로그아웃 시
export function logout() {
  delete axios.defaults.headers.common["Authorization"];
  localStorage.removeItem("token");
}

export default axios;