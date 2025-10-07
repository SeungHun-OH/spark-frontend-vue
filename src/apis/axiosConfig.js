import axios from "axios"

axios.defaults.baseURL = "http://localhost:8040";

//이 함수가 호출된 이후 모든 axios 요청에 자동으로 Authorization: Bearer <jwt> 헤더가 붙음
function addAuthHeader(jwt) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
}

// 글로벌 기본 헤더에서 Authorization 속성을 완전히 제거 //주로 로그아웃 시 호출
// function removeAuthHeader() {
//     delete axios.defaults.headers.common["Authorization"]; //"Authorization이라는 속성 제거"
// }

// export { addAuthHeader };

export default axios;