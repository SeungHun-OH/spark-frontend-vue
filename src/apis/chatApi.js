import axios from "./axiosConfig"

function getChatList() {
    
    return axios.get("/chat/list",{ headers : {
        // Authorization:"Bearer eyJhbGciOiJIUzUxMiJ9.eyJtZW1iZXJObyI6MSwiaWF0IjoxNzU5NTc5MTAyLCJleHAiOjE3NjA2NTkxMDJ9.bXe7xLBaMxPaucazjBAtSLCZqxdKDaDvGfxfm07z2AcLeRez8o8BwF_X7hNEqyDi7kY7D6JuYXYtcx8WI2w_Ng"
    }});
}

function getChattingMessageList(path) {

    return axios.get("/chat/chatting/"+path,{ headers : {
        // Authorization:"Bearer eyJhbGciOiJIUzUxMiJ9.eyJtZW1iZXJObyI6MSwiaWF0IjoxNzU5NTc5MTAyLCJleHAiOjE3NjA2NTkxMDJ9.bXe7xLBaMxPaucazjBAtSLCZqxdKDaDvGfxfm07z2AcLeRez8o8BwF_X7hNEqyDi7kY7D6JuYXYtcx8WI2w_Ng"
    }});
}

function updateLastMessage(lastMessageNo) {
  return axios.post(
    `/chat/message/read`,
    lastMessageNo,
    {
        headers: {
        "Content-Type": "application/json",
        // Authorization: "Bearer eyJhbGciOiJIUzUxMiJ9.eyJtZW1iZXJObyI6MSwiaWF0IjoxNzU5NTc5MTAyLCJleHAiOjE3NjA2NTkxMDJ9.bXe7xLBaMxPaucazjBAtSLCZqxdKDaDvGfxfm07z2AcLeRez8o8BwF_X7hNEqyDi7kY7D6JuYXYtcx8WI2w_Ng"
      }
    }
  );
}


const chatApi = {
  getChatList,
  getChattingMessageList,
  updateLastMessage
};

export default chatApi;