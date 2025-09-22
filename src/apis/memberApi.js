import axios from "axios";

function memberInsert(member) {
  return axios.post("http://localhost:8040/member", member)
}

function memberInsertPicture(formdata) {
  return axios.post("http://localhost:8040/member/picture", formdata)
}

function memberLogin(member) {
  return axios.post("http://localhost:8040/member/login", member)
}

function memberGetPicture(m_no) {
  return axios.get("http://localhost:8040/member/picture", {
    params: {
      m_no: m_no
    }
  });
}


const memberApi = {
  memberInsert,
  memberInsertPicture,

  memberLogin,
  memberGetPicture
};

export default memberApi;