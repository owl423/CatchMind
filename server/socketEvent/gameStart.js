import {random, findRoom, generateIntarval} from '../util';

// 게임 시작 이벤트
export default function gameStart(io, socket, roomList, quizList){
  socket.on('gameStart', (data)=>{
    const room = findRoom(roomList, data.roomName);
    if(room && room.userList.length < 2) {
      io.to(data.roomName).emit('gameStart', {message: '게임 가능한 최소 인원은 2명입니다.'});
      return;
    }
    const quiz = quizList[random(quizList.length)];
    room.isStart = true;
    room.quizList = [quiz];
    generateIntarval(io, room, quizList);
    room.writerNickName = room.userList[0].nickName;
    room.remainQuizCount = data.quizCount;
    io.to(data.roomName).emit('gameStart', {quiz});
  });
} 