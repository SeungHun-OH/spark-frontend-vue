import axios from "axios";

function insertThreadBoard(member) {
  return axios.post("http://localhost:8040/thread/board", member)
}

function getThreadBoardList() {
  return axios.get("http://localhost:8040/thread/boardList")
}

const threadboardApi = {
  insertThreadBoard,
  getThreadBoardList
};

export default threadboardApi;