import Nuxt from 'nuxt';
import express from 'express';
import http from 'http';
import socket from 'socket.io';
import api from './api';
import bodyParser from 'body-parser';
import {quizList, roomList} from './memorydb';
import socketEvent from './socketEvent';
// import multer from 'multer';
const app = express();
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

let server = http.Server(app);
let io = socket(server);
// let upload = multer({dest: './upload'});
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
    console.log('socket connection');
    // 입장 소켓 이벤트
    socketEvent.entrance(io, socket, roomList);
    // 채팅 메시지
    socketEvent.sendMsg(io, socket);
    // 그림 데이터 정보
    socketEvent.drawing(io, socket);
    // 그림 지우기
    socketEvent.clearBoard(io, socket);
    // 게임 시작
    socketEvent.gameStart(io, socket, roomList, quizList);
    // 정답 체크
    socketEvent.answerCheck(io, socket, roomList, quizList);
    // 턴 변경
    socketEvent.passTurn(io, socket, roomList, quizList);
    // 연결이 끊어졌을 경우
    socketEvent.disconnect(io, socket, roomList, quizList);
    

  });
}

start();

