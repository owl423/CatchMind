<template>
<div class="wrapper">
  <div v-if="isRoomCreate" class="room-wrapper">
    <div class="board-wrapper message">
      <h2 class="message-header">보드</h2>
      <canvas class="box message-body canvas"></canvas>
    </div>
    <div class="message chat-user-list-wrapper">
      <div class="user-list-wrapper">
        <h2 class="message-header"> 유저 목록</h2>
        <ul class="box user-list message-body">
          <li 
            v-for="user in roomUserList"
            :key="user">
            {{user.nickName}}
          </li>
        </ul>
      </div>
      <div class="chat-wrapper">
        <h2 class="message-header">채팅창</h2>
        <div class="chat message-body">
            <textarea name="" id="chatLog" readonly class="textarea chat-log"></textarea>
            <form class="input-wrapper" @submit.prevent>
              <label for="chatInput" class="a11y-hidden">채팅 입력창</label>
              <input type="text" id="chatInput" class="input is-small" :value="msg" @input="msgUpdate" @keyup.enter="sendMsg">
              <button type="button" class="button is-small" @click="sendMsg">전송</button>
            </form>
        </div>
      </div>
    </div>
  </div>
  <p v-else> 방 생성에 실패 했습니다. 다시 시도해 주세요</p>
</div>
</template>

<script>
import io from 'socket.io-client';
import {mapActions, mapGetters, mapMutations} from 'vuex';
function msgReform(nickName, msg){
  return `\n${nickName} : ${msg}`;
}
export default {
  data(){
    return {
      socket: null,
      msg: '',
      chatLog: '',
    };
  },
  mounted(){
    // 소켓 생성
    const socket = this.socket = io.connect();
    const nickName = this.nickName;
    const roomName = this.roomName;
    socket.emit('entrance', {nickName, roomName});
    socket.on('entrance', (data)=>{
      // userList 갱신
      this.setRoomUserList(data.userList);
    });
    socket.on('disconnect', (data)=>{
      // userList 갱신
      this.setRoomUserList(data.userList);
    });
    socket.on('resMsg', (data)=>{
      chatLog.value += msgReform(data.nickName, data.msg);
      chatLog.scrollTop = chatLog.scrollHeight;
    });
  },
  beforeRouteEnter: (to, from, next) => {
    next((vm)=>{
      if(vm.nickName && vm.roomName){
        vm.$router.push(`/room/${vm.roomName}`);
      } else {
        vm.$router.push('/');
      }
    });
  },
  destroyed(){
    console.log('죽음');
    this.socket.disconnect();
  },
  computed: {
    ...mapGetters([
      'roomName',
      'nickName',
      'roomUserList',
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
    msgUpdate(e){
      this.msg = e.target.value;
    },
    sendMsg(){
      if(this.msg.trim()){
        let msg = {
          roomName: this.roomName,
          nickName: this.nickName,
          msg: this.msg
        };
        this.socket.emit('sendMsg', msg);
        this.msg = '';
      }
    }
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
