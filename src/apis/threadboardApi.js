import axios from  "./axiosConfig";

function insertThreadBoard(member) {
  return axios.post("/thread/board", member)
}

function deleteThreadBoard(tbNo) {
  return axios.delete("/thread/board",{
    params: { tbNo: tbNo }
  });
}

function updateThreadBoard(threadBoard) {
  return axios.put("/thread/board", threadBoard);
}

function getThreadBoardList() {
  return axios.get("/thread/boardList")
}

function insertBoardReply(boardreply) {
  return axios.post("/thread/boardreply", boardreply)
}

function deleteBoardReply(brNo) {
  return axios.delete("/thread/boardreply",{
    params: { brNo: brNo }
  });
}

function updateBoardReply(boardreply) {
  return axios.put("/thread/boardreply", boardreply);
}

const threadboardApi = {
  insertThreadBoard,
  getThreadBoardList,
  deleteThreadBoard,
  updateThreadBoard,
  
  insertBoardReply,
  deleteBoardReply,
  updateBoardReply
};

export default threadboardApi;