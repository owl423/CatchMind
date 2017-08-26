<template>
  <div class="user-list-wrapper">
    <h2 class="message-header">사용자 목록({{roomUserList.length}}명)</h2>
    <ul class="box user-list message-body">
      <li 
        v-for="user in roomUserList"
        :key="user">
         <span class="writer-mark" v-if="user.nickName === writerNickName">출제자</span> 
         <span class="room-master-mark" v-if="user.nickName === masterNickName">방장</span> 
         {{user.nickName}}
      </li>
    </ul>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  // 데이터
  computed: {
    ...mapGetters([
      'roomUserList',
      'writerNickName',
      'masterNickName'
    ])
  }
};
</script>

<style>
  .writer-mark{
    background: orange;
    color: white;
    border-radius: 5px;
    padding: 0 5px;
    margin-right: 5px;
  }
  .room-master-mark{
    background: olive;
    color: white;
    border-radius: 5px;
    padding: 0 5px;
  }
</style>

