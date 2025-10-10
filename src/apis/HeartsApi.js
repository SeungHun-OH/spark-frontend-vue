import axios from "./axiosConfig"

/**
 * URL 뒤에 붙일 쿼리 파라미터 : params
 * 헤더(header)를 바꾸고 싶으면 :  headers
 * 타입아웃 같은 설정 : timeout
 */

function acceptHeart(heartsNo) {
    return axios.post(`/hearts/${heartsNo}/accept`);
}

function getHearts() {
    return axios.get("/hearts/");
}

function rejectHeartReqeust(heartsNo) {
    axios.delete(`/hearts/${heartsNo}/reject`);
}

const HeartsApi = {
    acceptHeart,
    getHearts,
    rejectHeartReqeust
};

export default HeartsApi;