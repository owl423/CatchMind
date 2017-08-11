<template>
  <div class="container">
    <div class="main">
      <h1 class="title is-1 main-title">Catch Mind</h1>
      <div class="box field main-box">
        <label class="label" for="input-nickname">닉네임</label>
        <p class="control has-icons-left has-icons-right">
          <input class="input" id="input-nickname" v-model="inputNickName" @keyup="changeDetect" type="text" placeholder="닉네임을 입력하세요.">
          <span class="icon is-small is-left">
            <i class="fa fa-user"></i>
          </span>
          <span class="icon is-small is-right">
            <i :class="['fa', isDuplicate ? 'fa-warning' : 'fa-check']"></i>
          </span>
        </p>
        <p v-if="infoMessage" :class="['help', chkDuplicate ? 'is-danger' : 'is-success']">{{ infoMessage }}</p>
        <div class="button-group">
          <button :class="[`button`, `is-primary`, `duplicate-check-btn`, `is-outlined`]" @click="validateNickName">중복확인</button>
          <button type="button" :class="[`button`, `is-outlined`, chkDuplicate === false ? 'is-primary' : 'is-danger']" @click.prevent="saveNickName">입장하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
// import axios from '~plugins/axios'
// import io from 'socket.io-client'
export default {
  // 데이터
  data () {
    return {
      inputNickName: '',
      infoMessage: '',
      isDuplicate: 'default'
    };
  },
  computed: {
    ...mapGetters([
      'nickName'
    ]),
    chkDuplicate: {
      get(){
        return this.isDuplicate;
      },
      set(str){
        this.isDuplicate = str;
      }
    }
  },
  // 라이프사이클
  mounted(){
    if(this.nickName){
      this.inputNickName = this.nickName;
      this.isDuplicate = false;
    }
  },
  // 라우팅
  beforeRouteEnter: (to, from, next) => {
    next();
  },
  // 메소드
  methods: {
    ...mapMutations([
      'setNickName'
    ]),
    ...mapActions([
      'chkNickName',
      'registNickName'
    ]),
    async saveNickName () {
      if (this.chkDuplicate === 'default') {
        this.chkDuplicate = 'notDuplicateChk';
      } else if(this.nickName && (this.chkDuplicate === false)){
        this.$router.push({ path: '/room-list' });
      } else if (this.chkDuplicate === false) {
        let registChk = await this.registNickName(this.inputNickName);
        if (registChk) {
          this.$router.push({ path: '/room-list' });
        } else {
          this.chkDuplicate = 'notDuplicateChk';
        }
      } 
    },
    changeDetect(){
      this.chkDuplicate = 'default';
      this.infoMessage = '닉네임 중복확인를 해주세요';
    },
    async validateNickName () {
      const inputNickName = this.inputNickName.trim();
      if (inputNickName) {
        const data = await this.chkNickName(inputNickName);
        this.isDuplicate = data.duplicate;
        this.infoMessage = data.result;
      } else {
        this.infoMessage = '닉네임을 입력하세요';
      }
    }
  }
};
</script>

<style>
.container{
  width: 100%;
  height: 100vh;
}
.main{
  width: 50%;
  margin: 0 auto;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.main-title{
  font-weight: bold;
}
.main-button{
  margin: 20px auto 0 auto;
  display: block;
}
.button-group{
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.duplicate-check-btn {
  margin-right: 10px;
}
</style>
