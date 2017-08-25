import {findRoom, randomQuiz, getNextWriterNickName} from '../util';

// 정답입력 확인 이벤트
export default function answerCheck(io, socket, roomList, quizList){
  socket.on('answerCheck', (data)=>{
    const room = findRoom(roomList, data.roomName);
    const roomQuizList = room.quizList;
    const answerCheck = data.answer === roomQuizList[roomQuizList.length-1];
    let sendData;
    if(answerCheck){
      // room의 remainQuizCount 값을 감소 시키고
      room.remainQuizCount--;
      // 0일경우 게임이 종료 되는 이벤트 발생하는 코드 작성 부분
      if(room.remainQuizCount === 0){
        room.isStart = false;
        io.to(data.roomName).emit('gameover');
      } else {
        const writerNickName = getNextWriterNickName(room);
        // 퀴즈 리스트에 기존에 출제 됐던 문제가 있는 지 확인해서 없는 문제로 생성
        let quiz = randomQuiz(quizList, roomQuizList);
        roomQuizList.push(quiz);
        sendData = {
          answer: true,
          nickName: data.nickName,
          writerNickName,
          quizAnswer: data.answer,
          quiz
        };
        room.time = 180;
      }
    } else {
      // 정답이 아닌경우
      // io.to(data.roomName).emit('answerCheck', {answer: false});
      sendData = {
        answer : false,
        nickName: data.nickName,
        wrongAnswer: data.answer,
      };
    }
    io.to(data.roomName).emit('answerCheck', sendData);
    io.to(data.roomName).emit('answerResult', sendData);
  });
}