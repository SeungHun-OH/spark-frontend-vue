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
      '@/views/Chats/ChatView.vue'
    ),
    props: true
  }
];

export default chats;
