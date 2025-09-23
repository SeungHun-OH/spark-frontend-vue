import axios from "axios"

function createFeed(feed, files) {
    return axios.post("/feed", feed, files);
}

const feedApi = {
    createFeed
};

export default feedApi;