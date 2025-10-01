import axios from "axios";

function insertThreadBoard(member) {
  return axios.post("http://localhost:8040/thread/board", member)
}

const threadboard = {
  insertThreadBoard
};

export default threadboard;