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

const memberApi = {
  memberLogin,
  memberCreate,
  memberUpdate,

  memberPictureGet,
  memberGet,

  memberInsert,
  memberInsertPicture,
};

export default memberApi;