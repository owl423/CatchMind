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
            <textarea name="" id="" readonly class="textarea chat-log"></textarea>
            <form class="input-wrapper">
              <label for="chat-input" class="a11y-hidden">채팅 입력창</label><input type="text" id="chat-input" class="input is-small">
              <button type="button" class="button is-small">전송</button>
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
export default {
  data(){
    return {
      socket: null
    };
  },
  mounted(){
    const socket = this.socket = io.connect();
    const nickName = this.nickName;
    const roomName = this.roomName;
    // const userObj = {
    //   nickName
    // };
    // console.log('socket: ', socket);
    // this.registRoomUser(userObj);
    socket.emit('entrance', {nickName, roomName});
    socket.on('entrance', (data)=>{
      console.log('data: ', data);
      this.setRoomUserList(data.userList);
    });
  },
  computed: {
    ...mapGetters([
      'roomName',
      'nickName',
      'roomUserList',
      'isRoomCreate'
    ])
  },
  methods:{
    ...mapActions([
      'registRoomUser',
      'getRoom'
    ]),
    ...mapMutations([
      'setRoomUserList'
    ])
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
