<template>
  <div class="container">
    <div class="main is-centered">
      <h1 class="title is-1 main-title room-list-title">방목록</h1>
      <div class="room-list box">
        <ul v-if="roomList.length !== 0">
          <li v-for="(room, index) in roomList" :key="room" class="box">
            {{room.roomName}}
            <a :href="`room/${room.roomName}`" :title="`${room.roomName}으로 입장`" class="button is-small" @click.prevent="enterRoom(room.roomName)">입장</a>
          </li>
        </ul>
        <p v-else> 생성된 방이 없습니다. 방을 생성해 주세요</p>
      </div>
      <div class="button-group">
        <a class="button is-primary is-medium is-outlined" @click="createRoom"> 방 만들러 가기</a>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';

export default {
  name: 'room',
  created(){
    this.getRoomList();
  },
  mounted(){
    console.log('this.roomList: ', this.roomList);
  },
  computed: {
    ...mapGetters([
      'roomList'
    ])
  },
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
      console.log('roomName: ', roomName);
      this.$router.push({path: `room/${roomName}`});
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
