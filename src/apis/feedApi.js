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

function getMyFeedList(page_no) {
    return axios.get("/feed/myfeed", {
        params : {page_no},
        headers : { Authorization:"Bearer eyJhbGciOiJIUzUxMiJ9.eyJtZW1iZXJObyI6MSwiaWF0IjoxNzU5MjE4NzgzLCJleHAiOjE3NTk1Nzg3ODN9.vcr-ZbZf0ChGAvgcbueIcF-e6Ekb_msDxAUxs9RhjwMIPMBTcZyFmhk6DxmdfI8tsoHvbYfyCgbvp5PuDS410g"}
    });
}

function getFeedList(m_nickname, page_no) {
    return axios.get("/feed/list", {
        params : {m_nickname, page_no},
    });
}


function updateFeed(feed, files) {
    return axios.put("/feed/", feed, files);
}

function deleteFeed(f_no) {
    return axios.delete("/feed/", {
        params : {f_no}
    });
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