<template>
  <div class="container">
      <div class="main is-centered">
        <h1 class="title is-1 main-title room-list-title">방만들기</h1>
        <div class="room-list box control">
          <label for="room-name">방 제목</label>
          <input class="input" id="room-name" v-model="roomName" type="text">
        </div>
        <div class="button-group">
          <a class="button is-primary is-outlined create-btn">만들기</a>
          <router-link to="/room" class="button is-danger is-outlined">취소</router-link>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      roomName: ''
    };
  }
};
</script>

<style>
  .create-btn{
    margin-right: 20px;
  }
</style>
