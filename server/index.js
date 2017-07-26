import Nuxt from 'nuxt';
import express from 'express';
import http from 'http';
import socket from 'socket.io';
import api from './api';
import bodyParser from 'body-parser';
import {userList, roomList} from './memorydb';
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
    console.log('connection');
    socket.on('entrance', (data)=>{
      socket.join(data.roomName);
      console.log('roomList: ', roomList);
      const room = roomList.find((room)=>room.roomName === data.roomName);
      if(room){
        room.userList.push({
          nickName: data.nickName,
          socketID: socket.id
        });
        io.to(data.roomName).emit('entrance', room);
      }
      console.log('room: ', room);
    });
    // socket.on('disconnect',()=>{
    //   let room;
    //   for(let i =0, l = roomList.length; i < l; i++ ){
    //     let r = roomList[i].userList.length;
    //     for(let j = 0; j < r; j++){
    //       if(userList[j].socketID === socket.id){
    //         userList.splice(j, 1);
    //         room = roomList[i];
    //         break;
    //       }
    //     }
    //   }
    //   console.log('room: ', room);
    //   io.to(room.roomName).emit('entrance', room);
    // });
  });
}

start();

