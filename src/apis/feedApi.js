import axios from "./axiosConfig"

/**
 * URL 뒤에 붙일 쿼리 파라미터 : params
 * 헤더(header)를 바꾸고 싶으면 :  headers
 * 타입아웃 같은 설정 : timeout
 */

function createFeed(feed, files) {
    return axios.post("/feed/", feed, files);
}

function getFeed(f_no) {
    return axios.get("/feed/list", {
        params : {f_no}
    });
}

function getFeedList(m_no, page_no) {
    return axios.get("/feed/list", {
        params : {m_no, page_no}
    });
}

function updateFeed(feed, files) {
    return axios.put("/feed/", feed, files);
}

function deleteFeed(f_no) {
    return axios.delete("/feed/", f_no);
}

const feedApi = {
    createFeed,
    getFeed,
    getFeedList,
    updateFeed,
    deleteFeed
};

export default feedApi;