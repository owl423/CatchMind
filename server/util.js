export const random = n => Math.floor( Math.random() * n );
export const findRoom = (roomList, roomName) => roomList.find(room => room.roomName === roomName);
export const leaveRoom = (roomList, exitRoom, exitUser) => {
  exitRoom.userList.splice(exitRoom.userList.findIndex((user)=> user === exitUser), 1);
  if(exitRoom.userList.length === 0){
    roomList.splice(roomList.findIndex(room => room === exitRoom), 1);
  } else if( exitUser.nickName === exitRoom.masterUser){
    exitRoom.masterUser = exitRoom.userList[0].nickName;
  }
};