import {leaveRoom, getNextWriterNickName, randomQuiz, setIntervalCallback} from '../util';

// 유저의 연결이 끊어졌을 경우 발생하는 이벤트
export default function disconnect(io, socket, roomList, quizList){
  socket.on('disconnect',()=>{
    let exitUser = null;
    // 나간 방을 찾아서
    const room = roomList.find((room)=>{
      // 나간 유저를 socketid로 찾는다.
      return exitUser = room.userList.find((user)=>user.socketID === socket.id);
    });
    // 방에서 나간 유저 제거
    if(room){
      let isWriter = false;
      let writerNickName;
      // 아직 게임이 시작 되지 않았을 경우
      if(!room.isStart){
        // 나간 유저를 해당 방에서 지우고 
        // 남은 유저가 없을 경우 그 방을 지운다.
        leaveRoom(roomList, room, exitUser);
      } else {
        // 게임이 시작됐을 경우
        leaveRoom(roomList, room, exitUser);
        isWriter = exitUser.nickName === room.writerNickName;
        if(room.userList.length < 2){
          room.isStart = false;
          io.to(room.roomName).emit('gameover');
        } 
        if(isWriter && room.userList.length > 1){
          // const writerIndex = room.userList.findIndex(roomUser => roomUser === exitUser);
          // nextWriterNickName = room.writerNickName = room.userList[(writerIndex + 1) % room.userList.length].nickName;
          let quiz = randomQuiz(quizList, room.quizList);
          writerNickName = getNextWriterNickName(room);
          room.quizList.push(quiz);
          clearInterval(room.setIntervalID);
          room.time = 180;
          io.to(room.roomName).emit('writerChange', {writerNickName, quiz});
          room.setIntervalID = setInterval(setIntervalCallback.bind(null, io, room, quizList), 1000);
        }
      }
      // 해당 room에 속한 사람들에게 전파
      socket.leave(room.roomName);
      writerNickName = isWriter && writerNickName;
      io.to(room.roomName).emit('disconnect', {
        userList: room.userList,
        writerNickName,
        exitUserNickName: exitUser.nickName,
        isWriter
      });
    }
  });
}