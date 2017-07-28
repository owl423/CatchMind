<template>
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
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  computed: {
    ...mapGetters([
      'roomUserList'
    ])
  }
};
</script>
