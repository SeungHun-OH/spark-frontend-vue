import axios from "axios";

function memberInsert(member) {
  return axios.post("http://localhost:8040/Member", member)
}

function memberInsertPicture(formdata) {
  return axios.post("http://localhost:8040/Member/picture", formdata)
}

function memberLogin(member) {
  return axios.post("http://localhost:8040/Member/login", member)
}

function memberGetPicture(m_no) {
  return axios.get("http://localhost:8040/Member/picture", {
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