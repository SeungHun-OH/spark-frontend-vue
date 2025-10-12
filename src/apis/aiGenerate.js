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

async function aiBoardReplyGenerate(count) {
  return axios.post(`/Ai/BoardReplyGenerate?count=${count}`);
}

const aiGenerate = {
  generateAnswerBoardQuestion,
  AiGenerateBoards,
  aiBoardReplyGenerate
};

export default aiGenerate;