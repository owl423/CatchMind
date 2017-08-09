<template>
  <div class="container">
      <div class="main is-centered">
        <h1 class="title is-1 main-title room-list-title">방만들기</h1>
        <div class="room-list box control">
          <label for="room-name">방 제목</label>
          <input class="input" id="room-name" v-model="inputRoomName" type="text">
          <p v-if="infoMessage" class="help is-danger"> {{infoMessage}}</p>
        </div>
        <div class="button-group">
          <a class="button is-primary is-outlined create-btn" @click="createRoom">만들기</a>
          <router-link to="/room" class="button is-danger is-outlined">취소</router-link>
        </div>
      </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
export default {
  // 데이터
  data(){
    return {
      inputRoomName: '',
      infoMessage: ''
    };
  },
  computed: {
    ...mapGetters([
      'roomName',
      'nickName'
    ])
  },
  // 라우팅
  beforeRouteEnter(to, from, next) {
    next(vm=>{
      if(from.name === 'room-list'){
        vm.$router.push('/room-create');
      } else {
        vm.$router.push('/room-list');
      }
    });
  },
  // 메소드
  methods : {
    ...mapActions([
      'chkRoomName',
      'registRoomName'
    ]),
    ...mapMutations([
      'setRoomName'
    ]),
    // 방 생성하기
    async createRoom(){
      // 방 이름 입력 확인
      if(this.inputRoomName.trim()){
        // 서버에 보내서 중복된 이름인지 확인
        let res = await this.chkRoomName(this.inputRoomName);
        if(res.success){
          // 중복된 이름이 없는경우
          this.setRoomName(this.inputRoomName);
          let roomObj = {
            roomName: this.roomName,
            masterUser: this.nickName,
            userList: []
          };
          this.registRoomName(roomObj);
          this.$router.push({path: `/room-list/${this.inputRoomName}`});
        } else {
          // 중복된 이름이 있는 경우
          this.infoMessage = res.result;
        }
      }
      else {
        this.infoMessage = '방제목을 입력해 주세요';
      }
    }
  }
};
</script>

<style>
  .create-btn{
    margin-right: 20px;
  }
</style>
