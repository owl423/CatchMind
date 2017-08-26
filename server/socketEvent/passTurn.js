import {randomQuiz, getNextWriterNickName, findRoom, setIntervalCallback} from '../util';
export default function passTurn(io, socket, roomList, quizList){
  socket.on('passTurn', (data)=>{
    const room = findRoom(roomList, data.roomName);
    const writerNickName = getNextWriterNickName(room);
    const quiz = randomQuiz(quizList, room.quizList);
    room.quizList.push(quiz);
    // console.log('pass Turn room: ', room);
    clearInterval(room.setIntervalID);
    room.time = 180;
    io.to(data.roomName).emit('writerChange', {writerNickName, quiz});
    room.setIntervalID = setInterval(setIntervalCallback.bind(null, io, room, quizList), 1000);
  });
}
