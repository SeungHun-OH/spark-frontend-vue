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

const memberApi = {
  memberLogin,
  memberCreate,

  memberPictureGet,
  memberGet,

  memberInsert,
  memberInsertPicture,
};

export default memberApi;