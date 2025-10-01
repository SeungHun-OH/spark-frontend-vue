import axios from "./axiosConfig"

function getFeedPictureList(f_no) {
    return axios.get("/feedPicture/list", {
        params : {f_no}
    });
}

function getFeedPicture(fp_no) {
    return axios.get("/feedPicture/picture", {
        params : {fp_no},
        responseType : 'arraybuffer' //기본으로 설정
    });
}

function getFirstImageofFeed(m_no) {
    return axios.get("/feedPicture/firstImg", {
        params : {m_no}
    });
}

const feedPictureApi = {
    getFeedPictureList,
    getFeedPicture,
    getFirstImageofFeed
};

export default feedPictureApi;