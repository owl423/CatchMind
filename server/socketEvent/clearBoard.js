// 그림판 clear 하는 이벤트
export default function clearBoard(io, socket){
  socket.on('clearBoard', (data)=>{
    io.to(data.roomName).emit('clearBoard');      
  });
}