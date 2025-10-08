import axios from "axios";

function memberLogin(member) {
  return axios.post("http://localhost:8040/member/login", member)
}

function memberCreate(formdata) {
  return axios.post("http://localhost:8040/member/create", formdata)
}

function memberGet(m_id) {
  return axios.get("http://localhost:8040/member", {
    params: { m_id: m_id }
  });
}

function memberPictureGet(m_no) {
  return axios.get("http://localhost:8040/member/picture", {
    params: { m_no: m_no }
  });
}

function memberInsert(member) {
  return axios.post("http://localhost:8040/member", member)
}

function memberInsertPicture(formdata) {
  return axios.post("http://localhost:8040/member/picture", formdata)
}

function getMemberPicture(m_nickname) {
  return axios.get(`/member/memberPicture/${encodeURIComponent(m_nickname)}`, {
    headers: { Authorization: "Bearer eyJhbGciOiJIUzUxMiJ9.eyJtZW1iZXJObyI6MSwiaWF0IjoxNzU5NTc5MTAyLCJleHAiOjE3NjA2NTkxMDJ9.bXe7xLBaMxPaucazjBAtSLCZqxdKDaDvGfxfm07z2AcLeRez8o8BwF_X7hNEqyDi7kY7D6JuYXYtcx8WI2w_Ng" }
  })
}

function selectMemberByMno() {
  return axios.get("/member/info", {
    headers: { Authorization: "Bearer eyJhbGciOiJIUzUxMiJ9.eyJtZW1iZXJObyI6MSwiaWF0IjoxNzU5NTc5MTAyLCJleHAiOjE3NjA2NTkxMDJ9.bXe7xLBaMxPaucazjBAtSLCZqxdKDaDvGfxfm07z2AcLeRez8o8BwF_X7hNEqyDi7kY7D6JuYXYtcx8WI2w_Ng" }
  });
}

function getRandomMembersExceptMe(myNo, count) {
  return axios.get("/member/randomExceptMe", {
    params: { mNo: myNo, count: count }
  });
}


const memberApi = {
  memberLogin,
  memberCreate,
  //memberUpdate,
  memberPictureGet,
  memberGet,

  memberInsert,
  memberInsertPicture,
  
  getMemberPicture,
  selectMemberByMno,
  getRandomMembersExceptMe
};

export default memberApi;