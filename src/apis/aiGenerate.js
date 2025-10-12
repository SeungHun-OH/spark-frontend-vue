import axios from "./axiosConfig"

async function generateAnswerBoardQuestion(question) {
  return axios.get("/Ai/generaeAnswerBoardQuestion",{
    params: {question : question}
  });
}

async function AiGenerateBoards(count) {
  return axios.get("/Ai/BoardGenerate/List",{
    params: {count : count}
  });
}


const aiGenerate = {
  generateAnswerBoardQuestion,
  AiGenerateBoards
};

export default aiGenerate;