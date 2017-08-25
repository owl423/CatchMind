import {randomQuiz, getNextWriterNickName, findRoom} from '../util';
export default function passTurn(io, socket, roomList, quizList){
  socket.on('passTurn', (data)=>{
    const room = findRoom(roomList, data.roomName);
    const writerNickName = getNextWriterNickName(room);
    const quiz = randomQuiz(quizList, room.quizList);
    io.to(data.roomName).emit('writerChange', {writerNickName, quiz});
    room.time = 180;
  });
}
