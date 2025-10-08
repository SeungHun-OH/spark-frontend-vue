import axios from "./axiosConfig"

function getFeedPictureList(f_no) {
    return axios.get("/feedPicture/list", {
        params: { f_no },
        headers: { Authorization: "Bearer eyJhbGciOiJIUzUxMiJ9.eyJtZW1iZXJObyI6MSwiaWF0IjoxNzU5NTc5MTAyLCJleHAiOjE3NjA2NTkxMDJ9.bXe7xLBaMxPaucazjBAtSLCZqxdKDaDvGfxfm07z2AcLeRez8o8BwF_X7hNEqyDi7kY7D6JuYXYtcx8WI2w_Ng" }
    });
}

function getFeedPicture(fp_no) {
    return axios.get("/feedPicture/picture", {
        params: { fp_no },
        responseType: 'arraybuffer', //기본으로 설정,
        headers: { Authorization: "Bearer eyJhbGciOiJIUzUxMiJ9.eyJtZW1iZXJObyI6MSwiaWF0IjoxNzU5NTc5MTAyLCJleHAiOjE3NjA2NTkxMDJ9.bXe7xLBaMxPaucazjBAtSLCZqxdKDaDvGfxfm07z2AcLeRez8o8BwF_X7hNEqyDi7kY7D6JuYXYtcx8WI2w_Ng" }
    });
}

function getFirstImageofFeed() {
    return axios.get("/feedPicture/firstImg", {
        headers: { Authorization: "Bearer eyJhbGciOiJIUzUxMiJ9.eyJtZW1iZXJObyI6MSwiaWF0IjoxNzU5NTc5MTAyLCJleHAiOjE3NjA2NTkxMDJ9.bXe7xLBaMxPaucazjBAtSLCZqxdKDaDvGfxfm07z2AcLeRez8o8BwF_X7hNEqyDi7kY7D6JuYXYtcx8WI2w_Ng" }
    });
}

function deleteFeedPicture(fpNo) {
  return axios.delete(`/feedPicture/${fpNo}`, {
    headers: { Authorization: "Bearer eyJhbGciOiJIUzUxMiJ9.eyJtZW1iZXJObyI6MSwiaWF0IjoxNzU5NTc5MTAyLCJleHAiOjE3NjA2NTkxMDJ9.bXe7xLBaMxPaucazjBAtSLCZqxdKDaDvGfxfm07z2AcLeRez8o8BwF_X7hNEqyDi7kY7D6JuYXYtcx8WI2w_Ng"},
  });
}

const feedPictureApi = {
    getFeedPictureList,
    getFeedPicture,
    getFirstImageofFeed,
    deleteFeedPicture
};

export default feedPictureApi;