import axios from "./axiosConfig"

async function generateAnswerBoardQuestion(question) {
  return axios.get("/Ai/generaeAnswerBoardQuestion",{
    params: {question : question}
  });
}

const aiGenerate = {
  generateAnswerBoardQuestion
};

export default aiGenerate;