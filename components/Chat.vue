<template>
  <div class="chat-wrapper">
    <h2 class="message-header">대화창</h2>
    <div class="chat message-body">
        <textarea name="" id="chatLog" readonly class="textarea chat-log"></textarea>
        <form class="input-wrapper" @submit.prevent>
          <label for="chatInput" class="a11y-hidden">채팅 입력창</label>
          <input type="text" id="chatInput" class="input is-small" :value="msg" @input="msgUpdate" @keyup.enter="sendMsg">
          <button type="button" class="button is-small" @click="sendMsg">전송</button>
        </form>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';

function msgReform(nickName, msg){
  return `\n${nickName} : ${msg}`;
}

export default {
  //  데이터
  data(){
    return {
      msg: '',
      isDestoyed: false
    };
  },
  computed: {
    ...mapGetters([
      'roomName',
      'nickName',
      'socket'
    ])
  },
  // 라이프사이클
  mounted(){
    const socket = this.socket;
    const roomName = this.roomName;
    const nickName = this.nickName;
    socket.emit('entrance', {nickName, roomName});
    socket.on('entrance', (data)=>{
      // 입장시 chatText로 알려줌
      chatLog.value += `\n${data.enterUser}님이 입장하셨습니다.`;
      // userList 갱신
      this.setRoomUserList(data.room.userList);
      this.setMasterNickName(data.room.userList[0].nickName);
      chatLog.scrollTop=chatLog.scrollHeight;
    });
    socket.on('resMsg', (data)=>{
      chatLog.value += msgReform(data.nickName, data.msg);
      chatLog.scrollTop=chatLog.scrollHeight;
    });
    socket.on('disconnect', (data)=>{
      if(!this.isDestoyed){
        // 퇴장시 chatText로 알려줌
        chatLog.value += `\n${data.exitUser.nickName}님이 퇴장하셨습니다.`;
        // userList 갱신
        this.setRoomUserList(data.room.userList);
        this.setMasterNickName(data.room.userList[0].nickName);        
        chatLog.scrollTop=chatLog.scrollHeight;
      }
    });
  },
  destroyed(){
    this.isDestoyed = true;
    this.socket.disconnect();
    this.setSocket(null);
  },
  // 메소드
  methods:{
    ...mapMutations([
      'setRoomUserList',
      'setMasterNickName',
      'setSocket'
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
