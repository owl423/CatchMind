export const random = n => Math.floor( Math.random() * n );
export const findRoom = (roomList, roomName) => roomList.find(room => room.roomName === roomName);
export const leaveRoom = (roomList, exitRoom, exitUser) => {
  exitRoom.userList.splice(exitRoom.userList.findIndex((user)=> user === exitUser), 1);
  if(exitRoom.userList.length === 0){
    clearInterval(exitRoom.setIntervalID);
    roomList.splice(roomList.findIndex(room => room === exitRoom), 1);
  } else if( exitUser.nickName === exitRoom.masterUser){
    exitRoom.masterUser = exitRoom.userList[0].nickName;
  }
};
export const randomQuiz = (quizList, roomQuizList) => {
  const len = quizList.length;
  let quiz;
  let count = 0;
  do{
    quiz = quizList[random(len)];
    if(count++ === len) break;
  } while (roomQuizList.findIndex(roomQuiz => roomQuiz === quiz) !== -1);
  return quiz;
};
export const getNextWriterNickName = (room) => {
  const writerIndex = room.userList.findIndex(roomUser => roomUser.nickName === room.writerNickName);
  const nextWriterNickName = room.writerNickName = room.userList[(writerIndex + 1) % room.userList.length].nickName;
  return nextWriterNickName;
};

export const generateIntarval = (io, room, quizList) => {
  room.time = 180;
  room.setIntervalID = setInterval(()=>{
    room.time--;
    if(room.time < 0){
      room.setIntervalID = generateIntarval(io, room, quizList, answer);
      let writerNickName = getNextWriterNickName(room);
      let newQuiz = randomQuiz(quizList, room.quizList);
      io.to(room.roomName).emit('writerChange', {writerNickName, quiz: newQuiz});
      room.time = 180;
      return;
    }
    io.to(room.roomName).emit('time', {time: room.time});
  }, 1000);
};