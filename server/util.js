export const random = n => Math.floor( Math.random() * n );
export const findRoom = (roomList, roomName) => roomList.find(room => room.roomName === roomName);