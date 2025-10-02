import axios from "./axiosConfig"

/**
 * URL 뒤에 붙일 쿼리 파라미터 : params
 * 헤더(header)를 바꾸고 싶으면 :  headers
 * 타입아웃 같은 설정 : timeout
 */

function createMatching(h_no) {
    return axios.post("/matching/", h_no);
}

function getMatching(mt_no) {
    return axios.get("/matching/", {
        params : {mt_no}
    });
}

function deleteMatching(mt_no) {
    return axios.delete("/matching/", {
        params : {mt_no}
    });
}

const MatchingApi = {
    createMatching,
    getMatching,
    deleteMatching
};

export default MatchingApi;