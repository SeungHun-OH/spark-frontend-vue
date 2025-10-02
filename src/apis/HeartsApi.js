import axios from "./axiosConfig"

/**
 * URL 뒤에 붙일 쿼리 파라미터 : params
 * 헤더(header)를 바꾸고 싶으면 :  headers
 * 타입아웃 같은 설정 : timeout
 */

function createHearts(hearts) {
    return axios.post("/hearts/", hearts);
}

function getHearts(h_requestchanel) {
    return axios.get("/hearts/", {
        params : {h_requestchanel}
    });
}

function deleteHearts(h_no) {
    return axios.delete("/hearts/", {
        params : {h_no}
    });
}

const HeartsApi = {
    createHearts,
    getHearts,
    deleteHearts
};

export default HeartsApi;