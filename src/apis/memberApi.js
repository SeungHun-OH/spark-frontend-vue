import axios from  "./axiosConfig";

function memberLogin(member) {
  return axios.post("/member/login", member)
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

  return axios.post("/member/create", formdata)
}

function memberUpdate(member) {
  console.log("memberUpdataApis호출" + JSON.stringify(member));
  return axios.put("/member", member)
}

function memberGet(mId) {
  return axios.get("/member", {
    params: { mId: mId }
  });
}

function memberPictureGet(mNo) {
  return axios.get("/member/picture", {
    params: { mNo: mNo }
  });
}

function memberInsert(member) {
  return axios.post("/member", member)
}

function memberInsertPicture(formdata) {
  return axios.post("/member/picture", formdata)
}

function memberGetJwt(jwt) {
  return axios.get("/member/getjwt", {
    headers: {
      Authorization : "Bearer " + jwt
    }
  })
}

const memberApi = {
  memberLogin,
  memberCreate,
  memberUpdate,

  memberPictureGet,
  memberGet,

  memberInsert,
  memberInsertPicture,

  memberGetJwt
};

export default memberApi;