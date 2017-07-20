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
        <p v-if="chkDuplicate === false" class="help is-success">사용할 수 있는 닉네임입니다.</p>
        <p v-else-if="chkDuplicate === true" class="help is-danger">사용할 수 없는 닉네임입니다.</p>
        <p v-else-if="chkDuplicate === 'notDuplicateChk'" class="help is-danger"> 중복확인을 해주세요.</p>
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
  data () {
    return {
      inputNickName: '',
      isDuplicate: 'default'
    };
  },
  mounted(){
    if(this.nickName){
      this.inputNickName = this.nickName;
      this.isDuplicate = false;
    }
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
        this.$router.push({ path: '/room' });
      } else if (this.chkDuplicate === false) {
        let registChk = await this.registNickName(this.inputNickName);
        if (registChk) {
          this.$router.push({ path: '/room' });
        } else {
          this.chkDuplicate = 'notDuplicateChk';
        }
      } 
    },
    changeDetect(){
      this.chkDuplicate = 'default';
    },
    duplicateChk(){
      console.log('this: ', this);
      // const socket = io.connect()
      // console.log(socket)
      // socket.on('news', function (data) {
      //   console.log(data)
      //   socket.emit('my event', {my: 'data'})
      // })
    },
    async validateNickName () {
      if (this.inputNickName.trim()) {
        this.isDuplicate = await this.chkNickName(this.inputNickName);
        console.log('this.isDuplicate: ', this.isDuplicate);
      }
      // get 으로 server에서 닉네임 목록 가지고 와서 중복 체크 하기
    }
    // async asyncData () {
    //   let { data } = await axios.get('/api/nickname')
    //   console.log(data)
    //   return {
    //     users: data
    //   }
    // }
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
