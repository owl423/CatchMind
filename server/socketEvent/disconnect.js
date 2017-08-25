import {leaveRoom, getNextWriterNickName, randomQuiz} from '../util';

// 유저의 연결이 끊어졌을 경우 발생하는 이벤트
export default function disconnect(io, socket, roomList, quizList){
  socket.on('disconnect',()=>{
    let exitUser = null;
    // 나간 방을 찾아서
    let exitRoom = roomList.find((room)=>{
      // 나간 유저를 socketid로 찾는다.
      return exitUser = room.userList.find((user)=>user.socketID === socket.id);
    });
    // 방에서 나간 유저 제거
    if(exitRoom){
      let isWriter = false;
      let writerNickName;
      // 아직 게임이 시작 되지 않았을 경우
      if(!exitRoom.isStart){
        // 나간 유저를 해당 방에서 지우고 
        // 남은 유저가 없을 경우 그 방을 지운다.
        leaveRoom(roomList, exitRoom, exitUser);
      } else {
        // 게임이 시작됐을 경우
        leaveRoom(roomList, exitRoom, exitUser);
        isWriter = exitUser.nickName === exitRoom.writerNickName;
        if(exitRoom.userList.length < 2){
          exitRoom.isStart = false;
          io.to(exitRoom.roomName).emit('gameover');
        } 
        if(isWriter){
          // const writerIndex = exitRoom.userList.findIndex(roomUser => roomUser === exitUser);
          // nextWriterNickName = exitRoom.writerNickName = exitRoom.userList[(writerIndex + 1) % exitRoom.userList.length].nickName;
          let quiz = randomQuiz(quizList, exitRoom.quizList);
          writerNickName = getNextWriterNickName(exitRoom);
          exitRoom.time = 180;
          io.to(exitRoom.roomName).emit('writerChange', {writerNickName, quiz});
        }
      }
      // 해당 room에 속한 사람들에게 전파
      socket.leave(exitRoom.roomName);
      writerNickName = isWriter && writerNickName;
      io.to(exitRoom.roomName).emit('disconnect', {
        room: exitRoom,
        writerNickName,
        exitUserNickName: exitUser.nickName,
        isWriter
      });
    }
  });
}