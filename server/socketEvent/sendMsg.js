export default function sendMsg(io, socket){
  socket.on('sendMsg', (data)=>{
    io.to(data.roomName).emit('resMsg', data);
  });
}