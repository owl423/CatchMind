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
      if(room.isStart){
        io.to(room.roomName).emit('playingEntrance', {
          writerNickName: room.writerNickName,
          isStart: room.isStart,
          time: room.time
        });
      }
      // 해당 룸 사람들에게 새로 입장한 사람의 정보 알려줌
      io.to(room.roomName).emit('entrance', {
        userList: room.userList, 
        enterUser: room.userList[room.userList.length-1].nickName
      });
    }
  });
}