<template>
  <div class="chat-wrapper">
    <h2 class="message-header">채팅창</h2>
    <div class="chat message-body">
        <textarea name="" ref="chatLog" readonly class="textarea chat-log"></textarea>
        <form class="input-wrapper" @submit.prevent>
          <label for="chatInput" class="a11y-hidden">채팅 입력창</label>
          <input type="text" id="chatInput" class="input is-small" :value="msg" @input="msgUpdate" @keyup.enter="sendMsg">
          <button type="button" class="button is-small" @click="sendMsg">전송</button>
        </form>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  props:[
    'socket',
    'chatText'
  ],
  data(){
    return {
      msg: ''
    };
  },
  computed: {
    ...mapGetters([
      'roomName',
      'nickName'
    ])
  },
  methods:{
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
