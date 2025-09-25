import axios from "axios"

function createFeed(feed, files) {
    return axios.post("/feed/", feed, files);
}

function getFeed(f_no) {
    return axios.get("/feed/", f_no);
}

function getFeedList(m_no) {
    return axios.get("/feed/list", m_no);
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