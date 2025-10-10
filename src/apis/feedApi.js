import axios from "./axiosConfig"

/**
 * URL 뒤에 붙일 쿼리 파라미터 : params
 * 헤더(header)를 바꾸고 싶으면 :  headers
 * 타입아웃 같은 설정 : timeout
 */

function createFeed(formdata) {
    return axios.post("/feed/", formdata);
}

function getFeed(f_no) {
    return axios.get("/feed/", {
        params: { f_no }
    });
}

function getMyFeedList(page_no) {
    return axios.get("/feed/myfeed", {
        params: { page_no }
    });
}

function getFeedList(m_nickname, page_no) {
    return axios.get("/feed/list", {
        params: { m_nickname, page_no },
    });
}

function updateFeed(formdata) {
    return axios.put("/feed/", formdata);
}

function deleteFeed(f_no) {
    return axios.delete("/feed/", {
        params: { f_no }});
}

const feedApi = {
    createFeed,
    getMyFeedList,
    getFeed,
    getFeedList,
    updateFeed,
    deleteFeed
};

export default feedApi;