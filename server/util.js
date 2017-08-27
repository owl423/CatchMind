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

export const setIntervalCallback = (io, room, quizList) => {
    room.time--;
    if(room.time < 1){
      clearInterval(room.setIntervalID);
      room.time = 180;
      room.setIntervalID = setInterval(setIntervalCallback.bind(null, io, room, quizList), 1000);
      const prevWriterNickName = room.writerNickName;
      const writerNickName = getNextWriterNickName(room);
      const newQuiz = randomQuiz(quizList, room.quizList);
      room.quizList.push(newQuiz);
      io.to(room.roomName).emit('passTurn', {prevWriterNickName, writerNickName, timeOut: true});
      io.to(room.roomName).emit('writerChange', {writerNickName, quiz: newQuiz});
      return;
    }
    io.to(room.roomName).emit('time', {time: room.time});
};