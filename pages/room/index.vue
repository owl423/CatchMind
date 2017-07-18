<template>
  <div class="container">
    <div class="main is-centered">
      <h1 class="title is-1 main-title room-list-title">방목록</h1>
      <div class="room-list box">
        <ul v-if="roomList.length !== 0">
          <li><a href="" title=""></a></li>
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
import {mapGetters} from 'vuex';

export default {
  name: 'room',
  computed: {
    ...mapGetters([
      'roomList'
    ])
  },
  methods: {
    createRoom(){
      this.$router.push({path: '/room-create'});
    }
  }
};
</script>

<style>
.room-list-title{
  text-align: center
}


</style>
