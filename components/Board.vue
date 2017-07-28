<template>
  <div class="board-wrapper message">
    <h2 class="message-header">보드</h2>
    <canvas id="canvas" class="box message-body canvas"></canvas>
  </div>
</template>
<script>
export default {
  props: [
    'socket'
  ]
};
</script>

