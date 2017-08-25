import {findRoom} from '../util';

// User가 방에 입장했을 때 발생하는 이벤트
export default function entrance(io, socket, roomList){
  socket.on('entrance', (data)=>{
    socket.join(data.roomName);
    const room = findRoom(roomList, data.roomName);
    if(room){
      room.userList.push({
        nickName: data.nickName,
        socketID: socket.id,
      });
      // 해당 룸 사람들에게 새로 입장한 사람의 정보 알려줌
      io.to(data.roomName).emit('entrance', {
        room, 
        enterUser: data.nickName
      });
      if(!room.isStart)return;
      io.to(data.roomName).emit('playingEntrance', {
        writerNickName: room.writerNickName,
        isStart: room.isStart,
        time: room.time
      });
    }
  });
}