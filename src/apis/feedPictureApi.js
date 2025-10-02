import axios from "./axiosConfig"

function getFeedPictureList(f_no) {
    return axios.get("/feedPicture/list", {
        params : {f_no},
        headers : { Authorization:"Bearer eyJhbGciOiJIUzUxMiJ9.eyJtZW1iZXJObyI6MSwiaWF0IjoxNzU5MjE4NzgzLCJleHAiOjE3NTk1Nzg3ODN9.vcr-ZbZf0ChGAvgcbueIcF-e6Ekb_msDxAUxs9RhjwMIPMBTcZyFmhk6DxmdfI8tsoHvbYfyCgbvp5PuDS410g"}
    });
}

function getFeedPicture(fp_no) {
    return axios.get("/feedPicture/picture", {
        params : {fp_no},
        responseType : 'arraybuffer', //기본으로 설정,
        headers : { Authorization:"Bearer eyJhbGciOiJIUzUxMiJ9.eyJtZW1iZXJObyI6MSwiaWF0IjoxNzU5MjE4NzgzLCJleHAiOjE3NTk1Nzg3ODN9.vcr-ZbZf0ChGAvgcbueIcF-e6Ekb_msDxAUxs9RhjwMIPMBTcZyFmhk6DxmdfI8tsoHvbYfyCgbvp5PuDS410g"}
    });
}

function getFirstImageofFeed() {
    return axios.get("/feedPicture/firstImg", {
        headers : { Authorization:"Bearer eyJhbGciOiJIUzUxMiJ9.eyJtZW1iZXJObyI6MSwiaWF0IjoxNzU5MjE4NzgzLCJleHAiOjE3NTk1Nzg3ODN9.vcr-ZbZf0ChGAvgcbueIcF-e6Ekb_msDxAUxs9RhjwMIPMBTcZyFmhk6DxmdfI8tsoHvbYfyCgbvp5PuDS410g"}
    });
}

const feedPictureApi = {
    getFeedPictureList,
    getFeedPicture,
    getFirstImageofFeed
};

export default feedPictureApi;