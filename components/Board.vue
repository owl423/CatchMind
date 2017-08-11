<template>
  <div class="board-wrapper message">
    <h1 class="message-header">보드</h1>
    <div ref="canvasWrapper" class="canvas-wrapper">
      <canvas 
      id="canvas" 
      class="box message-body canvas"
      ></canvas>
      <div class="tool-bar" @click="selectColor($event)">
        <button class="black button" title="검정">검정</button>
        <button class="red button" title="빨강">빨강</button>
        <button class="yellow button" title="노랑">노랑</button>
        <button class="green button" title="초록">초록</button>
        <button class="blue button" title="파랑">파랑</button>
        <button class="erase button" title="지우개" @click.stop="erase">
          <span class="icon is-small">
            <i class="fa fa-eraser"></i>
          </span>
        </button>
        <button class="all-erase button" @click.stop="clearBoard(true)">전체 지우기</button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import io from 'socket.io-client';
export default {
  // 데이터
  data () {
    return {
      // 현재 그림을 그리는 중 true
      isDrawing: false,
      context: null,
      current : {
        x: null,
        y: null,
        color: 'black'
      },
      isErase: false
    };
  },
  computed : {
    ...mapGetters([
      'roomName',
      'socket'
    ])
  },
  // 라이프사이클 훅
  mounted(){
    // 소켓 생성
    this.setSocket(io.connect());
    let canvasWrapperStyle = getComputedStyle(this.$refs.canvasWrapper);
    let socket = this.socket;
    // 캔버스 크기 설정
    canvas.width = parseInt(canvasWrapperStyle.width, 10);
    canvas.height = parseInt(canvasWrapperStyle.height, 10);
    this.context = canvas.getContext('2d');
    // 마우스 이벤트 바인딩
    canvas.onmousemove = this.delay(this.onMouseMove, 5);
    canvas.onmousedown = this.onMouseDown;
    canvas.onmouseup = this.onMouseUp;
    // 창크기가 바뀔경우 최소화
    window.onresize = function (){
      canvas.width = parseInt(canvasWrapperStyle.width, 10);
      canvas.height = parseInt(canvasWrapperStyle.height, 10);
    };
    socket.on('drawing', (data) => {
      // 현재 내 캔버스 사이즈에 맞게 그림
      let w = canvas.width;
      let h = canvas.height;
      this.draw(data.fromX * w, data.fromY * h, data.toX * w, data.toY * h, data.color, false, data.isErase);
    });
    socket.on('clearBoard', ()=>{
      this.clearBoard();
    });
  },
  // 메소드
  methods: {
    ...mapMutations([
      'setSocket'
    ]),
    onMouseUp(e){
      if(!this.isDrawing) return;
      this.isDrawing = false;
      this.draw(this.current.x, this.current.y, e.clientX, e.clientY, this.current.color, true, this.isErase);
    },
    onMouseDown(e){
      this.isDrawing = true;
      this.current.x = e.clientX;
      this.current.y = e.clientY;
    },
    onMouseMove(e){
      if(!this.isDrawing) return;
      this.draw(this.current.x, this.current.y, e.clientX, e.clientY, this.current.color, true, this.isErase);
      this.current.x = e.clientX;
      this.current.y = e.clientY;
    },
    delay(callback, delayTime){
      let before = new Date().getTime();
      return function(){
        let after = new Date().getTime();
        if((after - before >= delayTime)){
          before = after;
          callback.apply(null, arguments);
        }
      };
    },
    draw(fromX, fromY, toX, toY, color, emmit, isErase){
      let context = this.context;
      if(!isErase){
        context.beginPath();
        // 왼쪽 패딩과 위쪽 헤더영역 보정
        context.moveTo(fromX - 16, fromY - 37);
        context.lineTo(toX - 16, toY - 37);
        context.strokeStyle = color;
        context.lineWidth = 2;
        context.stroke();
        context.closePath();
      } else {
        let eraseSize = 30;
        let eraseX = toX - 16 - eraseSize/2;
        let eraseY = toY - 37 - eraseSize/2;
        context.clearRect(eraseX, eraseY, eraseSize, eraseSize);
      }
      // emmit 옵션이 없을 경우 === draw 이벤트를 받은 경우
      if(!emmit) return;
      // 각각의 클라이언트들에게 이벤트 송신
      let roomName = this.roomName;
      let w = canvas.width;
      let h = canvas.height;
      // 각각의 클라이언트의 캔버스 사이즈에 맞게 그리기 위해 비율로 만들어 전송
      this.socket.emit('drawing', {
        roomName,
        fromX: fromX/w,
        fromY: fromY/h,
        toX: toX/w,
        toY: toY/h,
        color,
        isErase
      });
    },
    selectColor(e){
      this.isErase = false;
      this.current.color=e.target.className.split(' ')[0];
    },
    erase(){
      this.isErase = true;
    },
    clearBoard(emit){
      this.context.clearRect(0, 0, canvas.width, canvas.height);
      if(!emit) return ;
      let roomName = this.roomName;
      this.socket.emit('clearBoard', {roomName});
    }
  }
};
</script>

<style>
.canvas-wrapper {
  flex: 0 1 100%;
  position: relative;
}
.box.canvas{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  cursor: default;
  flex: 0 1 auto;
  padding: 0;
  margin-bottom: 0;
}
.tool-bar{
  position: absolute;
  top: 0px;
  background: #eee;
  padding: 5px;
}
.black, .yellow, .green, .red, .blue{
  text-indent: -9999px;
  overflow: hidden;
  width: 36px;
  height: 36px;
  margin-left: 5px;
}
.black{
  margin-left: 0;
}
.erase, .all-erase {
  margin-left: 5px;
}
.black{
  background: black;
}
.yellow{
  background: yellow;
}
.green{
  background: green;
}
.red{
  background: red;
}
.blue{
  background: blue;
}

</style>
