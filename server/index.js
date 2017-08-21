import Nuxt from 'nuxt';
import express from 'express';
import http from 'http';
import socket from 'socket.io';
import api from './api';
import bodyParser from 'body-parser';
import {userList, roomList} from './memorydb';
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
      const room = roomList.find((room)=>room.roomName === data.roomName);
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
    socket.on('clearBoard', (data)=>{
      io.to(data.roomName).emit('clearBoard');      
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

