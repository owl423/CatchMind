<template>
  <div class="container">
    <div class="main is-centered">
      <h1 class="title is-1 main-title room-list-title">방목록 
        <span class="icon is-large button" @click="getRoomList">
          <i class="fa fa-refresh" aria-hidden></i>
        </span>
      </h1>
      <div class="room-list box">
        <ul v-if="roomList.length !== 0">
          <li v-for="(room, index) in roomList" :key="room">
            <a :href="`/${room.roomName}`" :title="`${room.roomName}으로 입장`" class="box" @click.prevent.stop="enterRoom(room.roomName)">
            방제 : {{room.roomName}} 방장 : {{room.masterUser}} 입장인원: {{room.userList.length}}
            <a :href="`/${room.roomName}`" class="button is-small" @click.prevent="enterRoom(room.roomName)">입장</a>
            </a>
          </li>
        </ul>
        <p v-else>생성된 방이 없습니다. 방을 생성해 주세요</p>
      </div>
      <div class="button-group">
        <a class="button is-primary is-medium is-outlined" @click="createRoom">방 만들러 가기</a>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';

export default {
  name: 'room',
  // 데이터
  computed: {
    ...mapGetters([
      'roomList',
      'nickName'
    ])
  },
  // 라이프사이클
  created(){
    this.getRoomList();
  },
  // 라우팅
  beforeRouteEnter: (to, from, next) => {
    next((vm)=>{
      vm.setRoomName('');
      if(vm.nickName){
        vm.$router.push({path: `/room-list`});
      } else {
        vm.$router.push('/');
      }
    });
  },
  // 메서드
  methods: {
    ...mapActions([
      'getRoomList'
    ]),
    ...mapMutations([
      'setIsRoomCreate',
      'setRoomName'
    ]),
    createRoom(){
      this.$router.push({path: '/room-create'});
    },
    enterRoom(roomName){
      this.setIsRoomCreate(true);
      this.setRoomName(roomName);
      this.$router.push({path: `/room-list/${roomName}`});
    }
  }
};
</script>

<style>
.room-list-title{
  text-align: center
}

.room-list{
  max-height: 60vh;
  overflow: scroll;
}
</style>
