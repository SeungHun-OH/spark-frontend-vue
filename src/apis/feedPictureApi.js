import axios from "./axiosConfig"

function getFeedPictureList(f_no) {
    return axios.get("/feedPicture/list", {
        params: { f_no }
    });
}

function getFeedPicture(fp_no) {
    return axios.get("/feedPicture/picture", {
        params: { fp_no },
        responseType: 'arraybuffer' //기본으로 설정
    });
}

function getFirstImageofFeed(m_no, page_no = 1) {
    return axios.get("/feedPicture/firstImg", {
        params : { m_no, page_no }
    });
}

function deleteFeedPicture(fpNo) {
  return axios.delete(`/feedPicture/${fpNo}`);
}

const feedPictureApi = {
    getFeedPictureList,
    getFeedPicture,
    getFirstImageofFeed,
    deleteFeedPicture
};

export default feedPictureApi;