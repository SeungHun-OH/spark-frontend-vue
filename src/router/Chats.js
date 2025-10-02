const chats = [
  {
    path: '/chat',
    component: () => import(
      /* webpackChunkName: "chat" */
      '@/views/Chats/ChatMain.vue'
    )
  },
  {
    path: '/chat/chatting/:chatRoomBaseUuid',
    component: () => import(
      /* webpackChunkName: "chat" */
      '@/views/Chats/ChatRoom.vue'
    ),
    props: true
  }
];

export default chats;
