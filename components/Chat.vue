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
      chatLog.value += `\nSystem : "${data.enterUser}"님이 입장하셨습니다.`;
      // userList 갱신
      this.setRoomUserList(data.userList);
      this.setMasterNickName(data.userList[0].nickName);
      chatLog.scrollTop=chatLog.scrollHeight;
    });
    socket.on('resMsg', (data)=>{
      chatLog.value += msgReform(data.nickName, data.msg);
      chatLog.scrollTop=chatLog.scrollHeight;
    });
    socket.on('answerResult', (data)=>{
      if(data.answer){
        chatLog.value += `\nSystem : "${data.nickName}"님이 "${data.quizAnswer}"을(를) 맞췄습니다.`;
        chatLog.value += `\nSystem : "${data.writerNickName}"님으로 출제자가 변경되었습니다.`;
      } else {
        chatLog.value += `\nSystem : "${data.nickName}"님의 오답은 "${data.wrongAnswer}"입니다.`;
      }
      chatLog.scrollTop=chatLog.scrollHeight;
    });
    socket.on('passTurn', (data)=>{
      chatLog.value += `\nSystem : "${data.prevWriterNickName}"님이 턴을 넘겼습니다.`;
      chatLog.value += `\nSystem : "${data.writerNickName}"님으로 출제자가 변경되었습니다.`;
      chatLog.scrollTop=chatLog.scrollHeight;
    });
    socket.on('disconnect', (data)=>{
      if(!this.isDestoyed){
        // 퇴장시 chatText로 알려줌
        chatLog.value += `\nSystem : "${data.exitUserNickName}"님이 퇴장하셨습니다.`;
        if(data.isWriter && data.writerNickName !== undefined){
          chatLog.value += `\nSystem : "${data.writerNickName}"님으로 출제자가 변경되었습니다.`;
        }
        if(data.isWriter && data.writerNickName === undefined){
          chatLog.value += `\nSystem : 인원 부족으로 게임이 끝났습니다.`;
        }
        // userList 갱신
        this.setRoomUserList(data.userList);
        this.setMasterNickName(data.userList[0].nickName);
        chatLog.scrollTop=chatLog.scrollHeight;
      }
    });
  },
  destroyed(){
    this.isDestoyed = true;
    this.setMasterNickName('');
    this.setRoomUserList('');
    this.setWriterNickName('');
    this.setRoomName('');
    this.socket.disconnect();
    this.setSocket(null);
  },
  // 메소드
  methods:{
    ...mapMutations([
      'setRoomUserList',
      'setMasterNickName',
      'setWriterNickName',
      'setSocket',
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
