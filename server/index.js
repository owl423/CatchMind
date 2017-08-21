import Nuxt from 'nuxt';
import express from 'express';
import http from 'http';
import socket from 'socket.io';
import api from './api';
import bodyParser from 'body-parser';
import {quizList, roomList} from './memorydb';
import {random, findRoom} from './util';
import multer from 'multer';
const app = express();
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

let server = http.Server(app);
let io = socket(server);
let upload = multer({dest: './upload'});
app.set('port', port);

// Import API Routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api', api);
// Start nuxt.js
async function start() {
  // Import and Set Nuxt.js options
  let config = require('../nuxt.config.js');
  config.dev = !(process.env.NODE_ENV === 'production');
  // Instanciate nuxt.js
  const nuxt = new Nuxt(config);
  // Add nuxt.js middleware
  app.use(nuxt.render);
  // Listen the server
  // app.listen(3001, host)
  server.listen(port, function(){
    console.log('Server listening on ' + host + ':' + port);
  });

  io.on('connection', function(socket){
    console.log('connection');
    // 입장 소켓 이벤트
    socket.on('entrance', (data)=>{
      socket.join(data.roomName);
      const room = findRoom(roomList, data.roomName);
      if(room){
        room.userList.push({
          nickName: data.nickName,
          socketID: socket.id
        });
        // 해당 룸 사람들에게 새로 입장한 사람의 정보 알려줌
        io.to(data.roomName).emit('entrance', {room, enterUser: data.nickName});
      }
    });
    // 채팅 메시지
    socket.on('sendMsg', (data)=>{
      io.to(data.roomName).emit('resMsg', data);
    });
    // 그림 데이터 정보
    socket.on('drawing', (data)=>{
      io.to(data.roomName).emit('drawing', data);
    });
    // 그림 지우기
    socket.on('clearBoard', (data)=>{
      io.to(data.roomName).emit('clearBoard');      
    });
    // 게임 시작
    socket.on('gameStart', (data)=>{
      const room = findRoom(roomList, data.roomName);
      if(room && room.userList.length < 2) {
        io.to(data.roomName).emit('gameStart', {message: '게임 가능한 최소 인원은 2명입니다.'});
        return;
      }
      const quiz = quizList[random(quizList.length)];
      room.isStart = true;
      room.quizList = [quiz];
      room.writer = room.userList[0];
      room.remainQuizConunt = room.userList.length;
      io.to(data.roomName).emit('gameStart', {quiz});
    });
    socket.on('answerCheck', (data)=>{
      const room = findRoom(roomList, data.roomName);
      const roomQuizList = room.quizList;
      const answerCheck = data.answer === roomQuizList[roomQuizList.length-1];
      let sendData;
      console.log('answerCheck: ', answerCheck);
      if(answerCheck){
        if(room.remainQuizCount === 0){
          // room의 remainQuizCount 값을 감소 시키고
          // 0일경우 게임이 종료 되는 이벤트 발생하는 코드 작성 부분
        } else {
          let quiz = quizList[random(quizList.length)];
          let writerIndex = room.userList.findIndex(roomUser => roomUser === room.writer);
          let nextWriter = room.writer = room.userList[(writerIndex + 1) % room.userList.length];
          // 퀴즈 리스트에 기존에 출제 됐던 문제가 있는 지 확인해서 없는 문제로 생성
          while(roomQuizList.findIndex(roomQuiz => roomQuiz === quiz) !== -1){
            quiz = quizList[random(quizList.length)];
          }
          roomQuizList.push(quiz);
          sendData = {
            answer: true,
            quiz,
            writerNickName : nextWriter.nickName
          };
        }
      } else {
        // 정답이 아닌경우
        // io.to(data.roomName).emit('answerCheck', {answer: false});
        sendData = {answer : false};
      }
      io.to(data.roomName).emit('answerCheck', sendData);
    });
    // 연결이 끊어졌을 경우
    socket.on('disconnect',()=>{
      let exitUser;
      // 나간 방을 찾아서
      let exitRoom = roomList.find((room)=>{
        // 나간 유저를 socketid로 찾는다.
        return exitUser = room.userList.find((user)=>user.socketID === socket.id);
      });
      // 방에서 나간 유저 제거
      if(exitRoom){
        exitRoom.userList.splice(exitRoom.userList.findIndex((user)=> user === exitUser), 1);
        if(exitRoom.userList.length === 0){
          roomList.splice(roomList.findIndex(room => room === exitRoom), 1);
        } else if( exitUser.nickName === exitRoom.masterUser){
          exitRoom.masterUser = exitRoom.userList[0].nickName;
        }
        // 해당 room에 속한 사람들에게 전파
        socket.leave(exitRoom.roomName);
        io.to(exitRoom.roomName).emit('disconnect', {room: exitRoom, exitUser});
      }
    });

  });
}

start();

