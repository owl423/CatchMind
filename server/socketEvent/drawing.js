// 그림 그리는 이벤트
export default function drawing(io, socket){
  socket.on('drawing', (data)=>{
    io.to(data.roomName).emit('drawing', data);
  });
}