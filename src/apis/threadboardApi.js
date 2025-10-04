import axios from  "./axiosConfig";

function insertThreadBoard(member) {
  return axios.post("/thread/board", member)
}

function getThreadBoardList() {
  return axios.get("/thread/boardList")
}

const threadboardApi = {
  insertThreadBoard,
  getThreadBoardList
};

export default threadboardApi;