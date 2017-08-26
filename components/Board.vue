<template>
  <div class="board-wrapper message">
    <h1 class="message-header">그림판(방제 : {{roomName}})</h1>
    <div ref="canvasWrapper" class="canvas-wrapper">
      <div v-if="!isStart" class="center">
        <input v-if="nickName === masterNickName" type="number" min="1" max="10" class="input quiz-count" v-model="quizCount" placeholder="문제수(1~10)를 입력해주세요">
        <button class="button is-large is-primary button-start" @click="onStart" >{{nickName === masterNickName ? '시작하기' : '대기중'}}</button>
        <p class="is-danger help start-error-message"> {{message}} </p>
      </div>
      <div v-else class="quiz-group">
        <div v-if="nickName === writerNickName" class="quiz-window">
          <h2 class="quiz-title">문제</h2>
          <p class="quiz-content">{{quiz}}</p>
        </div>
        <div v-else class="quiz-answer-wrapper">
          <label for="quiz-input">정답 입력</label>
          <input type="text" class="input quiz-answer" id="quiz-input" v-model="quizInput" placeholder="정답을 입력하고 Enter를 누르세요" @keydown.enter="onAnswerCheck">
        </div>
      </div>
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
        <button class="black button circle" title="검은 원" @click.stop="onCircle">검은 원 그리기</button>
        <button class="erase button" title="지우개" @click.stop="onErase">
          <span class="icon is-small">
            <i class="fa fa-eraser"></i>
          </span>
        </button>
        <button class="all-erase button" @click.stop="clearBoard(true)">전체 지우기</button>
      </div>
      <button class="button is-danger exit-btn" @click="exitRoom">게임 나가기</button>
      <div class="time">
        <div class="remain-wrapper">
          <span class="remain-title"><i class="fa fa-clock-o" aria-hidden="true"></i></span>
          <span :class="['remain-time', numTime < 60 ? 'is-danger': '']">{{time}}</span>
        </div>
        <div>
          <span class="desc">
            {{ numTime > 120 
            ? '시작 후 60초가 지나면 턴 넘기기 버튼이 활성화 됩니다.' 
            : '남은 시간이 0이 되면 턴이 자동으로 넘어갑니다.' }}
          </span>
        </div>
      </div>
      <button class="button is-normal pass-btn is-light" v-if="writerNickName === nickName" :disabled="numTime > 120" @click="passTurn">턴 넘기기</button>
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
      // 퀴즈 설정
      quiz: '',
      quizInput: '',
      quizCount: '',
      // 현재 그림을 그리는 중 true
      isDrawing: false,
      isStart: false,
      context: null,
      current : {
        x: null,
        y: null,
        color: 'black'
      },
      isErase: false,
      isCircle: false,
      message: '',
      numTime: 180
    };
  },
  computed : {
    ...mapGetters([
      'roomName',
      'socket',
      'nickName',
      'writerNickName',
      'masterNickName'
    ]),
    time(){ 
      let m = Math.floor(this.numTime / 60);
      let s = this.numTime % 60;
      s = s < 10 ? '0'+s : s;
      return `${m} : ${s}`;
    }
  },
  // 라이프사이클 훅
  mounted(){
    // 소켓 생성
    this.setSocket(io.connect());
    const canvasWrapperStyle = getComputedStyle(this.$refs.canvasWrapper);
    const socket = this.socket;
    // 캔버스 크기 설정
    canvas.width = parseInt(canvasWrapperStyle.width, 10);
    canvas.height = parseInt(canvasWrapperStyle.height, 10);
    this.context = canvas.getContext('2d');
    // 마우스 이벤트 바인딩
    this.onMouseEventBind(true);
    // 창크기가 바뀔경우 최소화
    window.onresize = function (){
      canvas.width = parseInt(canvasWrapperStyle.width, 10);
      canvas.height = parseInt(canvasWrapperStyle.height, 10);
    };
    socket.on('drawing', (data) => {
      // 현재 내 캔버스 사이즈에 맞게 그림
      const w = canvas.width;
      const h = canvas.height;
      data.current.x *= w;
      data.current.y *= h;
      this.draw(data.current, data.toX * w, data.toY * h, false, data.isErase, data.isCircle);
    });
    socket.on('clearBoard', () => {
      this.clearBoard();
    });
    socket.on('gameStart', (data) => {
      if(data.message){
        this.message = data.message;
        return;
      }
      this.isStart = true;
      this.setWriterNickName(this.masterNickName);
      this.onMouseEventBind(this.nickName === this.writerNickName);
      this.quiz = data.quiz;
      this.clearBoard(true);
    });
    socket.on('answerCheck', (data) => {
      if(data.answer){
        this.setWriterNickName(data.writerNickName);
        this.quiz = data.quiz;
        this.quizInput = '';
        this.clearBoard(true);
        this.onMouseEventBind(this.nickName === this.writerNickName);
      } else {
        this.quizInput = '';
      }
    });
    socket.on('writerChange', (data)=>{
      this.setWriterNickName(data.writerNickName);
      this.clearBoard(true);
      this.quiz = data.quiz;
      this.onMouseEventBind(this.nickName === this.writerNickName);
    });
    socket.on('gameover', ()=>{
      this.onMouseEventBind(true);
      this.setWriterNickName('');
      this.clearBoard(true);
      this.isStart = false;
      this.message = '게임이 끝났습니다.';
    });
    socket.on('playingEntrance', (data)=>{
      this.setWriterNickName(data.writerNickName);
      this.isStart = data.isStart;
      this.numtime = data.time;
      this.onMouseEventBind(this.writerNickName === this.nickName);
    });
    socket.on('time', (data)=>{
      this.numTime = data.time;
    });
  },
  // 메소드
  methods: {
    ...mapMutations([
      'setSocket',
      'setWriterNickName',
      'setMasterNickName'
    ]),
    onMouseUp(e){
      if(!this.isDrawing) return;
      this.isDrawing = false;
      this.draw(this.current, e.clientX, e.clientY, true, this.isErase, this.isCircle);
    },
    onMouseDown(e){
      this.isDrawing = true;
      this.current.x = e.clientX;
      this.current.y = e.clientY;
    },
    onMouseMove(e){
      if(!this.isDrawing) return;
      this.draw(this.current, e.clientX, e.clientY, true, this.isErase, this.isCircle);
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
    draw({x, y, color}, toX, toY, emmit, isErase, isCircle){
      const context = this.context;
      const correctFromX = x - 16;
      const correctFromY = y - 50;
      const correctToX = toX - 16;
      const correctToY = toY - 50;
      if(!isErase && !isCircle){
        context.beginPath();
        // 왼쪽 패딩과 위쪽 헤더영역 보정
        context.moveTo(correctFromX, correctFromY);
        context.lineTo(correctToX, correctToY);
        context.strokeStyle = color;
        context.lineWidth = 2;
        context.stroke();
        context.closePath();
      } else if(isErase){
        const eraseSize = 30;
        const eraseX = correctToX - eraseSize/2;
        const eraseY = correctToY - eraseSize/2;
        context.clearRect(eraseX, eraseY, eraseSize, eraseSize);
      } else if(isCircle){
        const radius = 15;
        context.beginPath();
        context.arc(correctToX, correctToY, radius, 0, 2 * Math.PI);
        context.fillStyle = color;
        context.fill();
      }
      // emmit 옵션이 없을 경우 === draw 이벤트를 받은 경우
      if(!emmit) return;
      // 각각의 클라이언트들에게 이벤트 송신
      const roomName = this.roomName;
      const w = canvas.width;
      const h = canvas.height;
      // 각각의 클라이언트의 캔버스 사이즈에 맞게 그리기 위해 비율로 만들어 전송
      this.socket.emit('drawing', {
        roomName,
        current: {
          x: x/w,
          y: y/h,
          color,
        },
        toX: toX/w,
        toY: toY/h,
        isErase,
        isCircle
      });
    },
    selectColor(e){
      this.isErase = false;
      this.isCircle= false;
      this.current.color=e.target.className.split(' ')[0];
    },
    onErase(){
      this.isCircle = false;
      this.isErase = true;
    },
    onCircle(e){
      this.isErase = false;
      this.isCircle = true;
      this.current.color=e.target.className.split(' ')[0];
    },
    onMouseEventBind(bool){
      if(bool){
        canvas.onmousemove = this.delay(this.onMouseMove, 10);
        canvas.onmousedown = this.onMouseDown;
        canvas.onmouseup = this.onMouseUp;
      } else {
        canvas.onmousemove = null;
        canvas.onmousedown = null;
        canvas.onmouseup = null;
      }
    },
    clearBoard(emit){
      this.context.clearRect(0, 0, canvas.width, canvas.height);
      if(!emit) return ;
      if(this.nickName !== this.writerNickName) return;
      let roomName = this.roomName;
      this.socket.emit('clearBoard', {roomName});
    },
    onStart(){
      if(this.nickName !== this.masterNickName) return;
      if(this.quizCount > 10 || this.quizCount < 1) {
        this.message = '문제 수는 1 ~ 10문제까지만 가능합니다.';
        return;
      }
      this.socket.emit('gameStart', {
        roomName : this.roomName,
        quizCount: this.quizCount
      });
    },
    onAnswerCheck(){
      let answer = this.quizInput;
      if(!answer.trim()) return;
      this.socket.emit('answerCheck', {
        roomName: this.roomName,
        nickName: this.nickName,
        answer
      });
    },
    exitRoom(){
      let message = '정말 방을 나가시겠습니까?';
      let result = confirm(message);
      if(!result) return;
      this.$router.push({path: '/room-list'});
    },
    passTurn(){
      if(this.nickName !== this.writerNickName) return;
      this.socket.emit('passTurn', {roomName: this.roomName});
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
  top: 0;
  left: 0;
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
.black.circle{
  border-radius: 50%;
  margin-left: 5px;
}

.erase, .all-erase {
  margin-left: 5px;
}
.black{
  margin-left: 0;
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
.button-start{
  left: 50%;
  transform: translateX(-50%);
}
.quiz-group{
  z-index: 1000;
  position: absolute;
  top: 0;
  right: 0;
  padding: 5px 5px;
  border-radius: 10px;
}
.center{
  position: absolute;
  z-index: 10000;
  top: 0;
  left: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 220px;
}
.quiz-window, .quiz-answer-wrapper{
  border: 3px solid orange;
  border-radius: 10px;
  display: flex;
  font-size: 18px;
  
}
.quiz-title{
  background: orange;
  color: #fff;
  padding: 5px;
}
.quiz-content{
  padding: 5px;
}
.quiz-answer{
  width: 250px;
  border-radius: 10px;
}
.input.quiz-count {
  margin-bottom: 10px;
}
.start-error-message{
  text-align: center;
}
.exit-btn{
  position: absolute;
  right: 5px;
  bottom: 5px;
}
[for="quiz-input"]{
  height: 36px;
  display: inline-block;
  line-height: 36px;
  color: #fff;
  margin: 0 10px;
}
.quiz-answer-wrapper{
  background-color: orange;
}
.time {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}
.desc {
  display: block;
  font-size: 14px;
  line-height: 1;
}
.remain-title, .remain-time{
  display: inline-block;
}
.remain-title {
  width: 30px;
}
.remain-time {
  width: 80px;
}
.pass-btn {
  position: absolute;
  right: 5px;
  top: 53px;
}
.remain-wrapper{
  margin: 0 auto;
  width: 110px;
}
.remain-title i, .remain-time {
  font-size: 30px;
  line-height: 1;
  vertical-align: middle
}

</style>
