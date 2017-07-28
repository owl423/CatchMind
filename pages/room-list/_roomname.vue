<template>
<div class="wrapper">
  <div v-if="isRoomCreate" class="room-wrapper">
    <board :socket="socket"></board>
    <div class="message chat-user-list-wrapper">
      <user-list></user-list>
      <chat :socket="socket" ref="chatWindow"></chat>
    </div>
  </div>
  <p v-else>방 생성에 실패 했습니다. 다시 시도해 주세요</p>
</div>
</template>

<script>
import io from 'socket.io-client';
import {mapActions, mapGetters, mapMutations} from 'vuex';
import Chat from '~components/Chat';
import UserList from '~components/UserList';
import Board from '~components/Board';
function msgReform(nickName, msg){
  return `\n${nickName} : ${msg}`;
}
export default {
  components: {
    Chat,
    UserList,
    Board
  },
  data(){
    return {
      socket: null,
      msg: '',
      chatText: '',
      is_destoyed: false
    };
  },
  mounted(){
    // 소켓 생성
    const socket = this.socket = io.connect();
    const nickName = this.nickName;
    const roomName = this.roomName;
    const chatLog = this.$refs.chatWindow.$refs.chatLog;
    socket.emit('entrance', {nickName, roomName});
    socket.on('entrance', (data)=>{
      // 입장시 chatText로 알려줌
      chatLog.value += `\n${data.enterUser}님이 입장하셨습니다.`;
      // userList 갱신
      this.setRoomUserList(data.room.userList);
    });
    socket.on('disconnect', (data)=>{
      // 퇴장시 chatText로 알려줌
      if(!this.is_destoyed){
        chatLog.value += `\n${data.exitUser.nickName}님이 퇴장하셨습니다.`;
        // userList 갱신
        this.setRoomUserList(data.room.userList);
      }
    });
    socket.on('resMsg', (data)=>{
      chatLog.value += msgReform(data.nickName, data.msg);
      chatLog.scrollTop=chatLog.scrollHeight;
    });
  },
  beforeRouteEnter: (to, from, next) => {
    next((vm)=>{
      if(vm.nickName && vm.roomName){
        vm.$router.push(`/room-list/${vm.roomName}`);
      } else {
        vm.$router.push('/');
      }
    });
  },
  destroyed(){
    this.is_destoyed = true;
    this.socket.disconnect();
  },
  computed: {
    ...mapGetters([
      'roomName',
      'nickName',
      'isRoomCreate'
    ]),
  },
  methods:{
    ...mapActions([
      'registRoomUser',
      'getRoom'
    ]),
    ...mapMutations([
      'setRoomUserList',
      'setRoomName'
    ]),
  }
};
</script>

<style>
html{
  overflow: hidden;
}
.a11y-hidden{
  position: absolute;
  height: 1px;
  width: 1px;
  margin: -1px;
  clip: rect(0, 0, 0, 0);
}
.room-wrapper {
  display: flex;
  height: 100vh;
  width: 100%;
  padding: 1em;
}
.room-wrapper .board-wrapper{
  flex: 6 0 auto;
  /* height: 95vh; */
  margin-bottom: 0; 
  padding-right: 1em;
  display: flex;
  flex-direction: column;
}
.message-header{
  justify-content: center;
}
.board-wrapper .message-body{
  flex-basis: 100%
}
.chat-user-list-wrapper{
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  overflow: scroll
}
.user-list-wrapper {
  flex-basis: 20%;
  flex-grow: 1;
  padding-bottom: 1em;
}
.user-list{
  overflow: scroll;
}
.chat-wrapper{
  flex-basis: 80%;
  flex-grow: 4;
  display: flex;
  flex-direction: column;
}
.chat{
  flex-basis: 100%;
  display: flex;
  flex-direction: column;
}
.chat .chat-log{
  flex-basis: 100%;
  margin-bottom: 0;
  flex-grow: 5
}
.input-wrapper{
  padding-top: 1em;
  flex-grow: 1;
  display: flex;
}
</style>
