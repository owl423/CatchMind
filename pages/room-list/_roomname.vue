<template>
<div class="wrapper">
  <div v-if="isRoomCreate" class="room-wrapper">
    <board></board>
    <div class="message chat-user-list-wrapper">
      <user-list></user-list>
      <chat></chat>
    </div>
  </div>
  <p v-else>방 생성에 실패 했습니다. 다시 시도해 주세요</p>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import Chat from '~components/Chat';
import UserList from '~components/UserList';
import Board from '~components/Board';

export default {
  // 하위 컴포넌트
  components: {
    Chat,
    UserList,
    Board
  },
  // 데이터
  computed: {
    ...mapGetters([
      'roomName',
      'nickName',
      'isRoomCreate',
    ]),
  },
  // 라우팅
  beforeRouteEnter: (to, from, next) => {
    next((vm)=>{
      if(vm.nickName && vm.roomName){
        vm.$router.push(`/room-list/${vm.roomName}`);
      } else {
        vm.$router.push('/');
      }
    });
  },
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
