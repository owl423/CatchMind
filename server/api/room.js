import { Router } from 'express';
import { roomList } from '../memorydb';
var router = Router();

router.get('/roomList', function(req, res){
  let query = req.query;
  if(query.roomName){
    // query가 있는 경우 roomList에서 같은 이름을 가진 방이 있는지 확인
    if(roomList.includes((room)=>room.name === query.roomName))
      return res.json({
        success: false,
        result: '사용할 수 없는 방이름 입니다.'
      });
    else{
      return res.json({
        success: true,
        result: '사용할 수 있는 방이름 입니다.'
      });
    }
  }
  else {
    // query가 없는 경우 roomList 전체 반환
    res.json(roomList);
  }
});
router.post('/roomList',function(req, res){
  if(req.body){
    roomList.push(req.body);
    res.json({
      success: true,
      result: '방 생성에 성공 했습니다.'
    });
  } else {
    res.json({
      success: false,
      result: '방 생성에 실패 했습니다.'
    });
  }
});
router.get('roomList/:roomName', function(req, res){
  const room = roomList.find((room)=>room.roomName === req.params.roomName);
  if (room){
    res.json({
      room,
    });  
  } else {
    res.json({
      room: null,
      result: '해당 roomName을 가진 room이 존재하지 않습니다.'
    });
  }
});
router.put('/roomList/:roomName', function(req, res){
  const roomName = req.params.roomName;
  roomList.find((room)=> room.roomName === roomName).userList.push(req.body);
  res.json({
    success: true
  });
});
export default router;