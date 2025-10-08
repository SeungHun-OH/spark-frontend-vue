import axios from "axios";

function memberLogin(member) {
  return axios.post("http://localhost:8040/member/login", member)
}

function memberCreate(formdata) {

  console.log("보내는 FormData 내용");
  for (let pair of formdata.entries()) {
    console.log(pair[0], pair[1]);
  }

  const reader = new FileReader();
  reader.onload = () => {
    console.log("member JSON 내용:", reader.result);
  };
  reader.readAsText(formdata.get("member"));

  return axios.post("http://localhost:8040/member/create", formdata)
}

function memberUpdate(member) {
  console.log("memberUpdataApis호출" + JSON.stringify(member));
  return axios.put("http://localhost:8040/member", member)
}

function memberGet(mId) {
  return axios.get("http://localhost:8040/member", {
    params: { mId: mId }
  });
}

function memberPictureGet(mNo) {
  return axios.get("http://localhost:8040/member/picture", {
    params: { mNo: mNo }
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


function memberGetJwt(jwt) {
  return axios.get("http://localhost:8040/member/getjwt", {
    headers: {
      Authorization : "Bearer " + jwt
    }
  })
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
  getRandomMembersExceptMe,
  memberGetJwt
};

export default memberApi;