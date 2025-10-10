import axios from "./axiosConfig"

function loginMemebr(loginForm) {
    return axios.post("/login", loginForm);
}

export async function getMemberInfoByToken() {
  console.log("Axios 공통 헤더:", axios.defaults.headers.common);
  return axios.get("/api/myInfo");
}


const loginApi = {
  loginMemebr,
  getMemberInfoByToken
};

export default loginApi;