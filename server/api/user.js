import { Router } from 'express';
import { userList } from '../memorydb';
var router = Router();

// 닉네임 중복 체크 함수
function checkDuplicate(nickName){
  return userList.find(user=> user === nickName);
}

// user_list 또는 쿼리로 넘어온 Nickname의 중복체크 
router.get('/user_list', function(req, res){
  if(req.query.nickName){
    if(checkDuplicate(req.query.nickName)){
      res.json({
        duplicate: true,
        result: '중복된 닉네임입니다.'
      });
    }
    else {
      res.json({
        duplicate: false,
        result: '사용할 수 있는 닉네임입니다.'
      });
    }
  }
  else {
    res.json(userList);
  }
});

// userList에 Nickname이 중복되지 않으면 추가
router.post('/user_list', function(req, res){
  let nickName = req.body.nickName;
  // 중복이 됐다면
  if(checkDuplicate(nickName)){
    let json = {
      success : false,
      nickName : '',
      result: 'Duplicate Nickname'
    };
    res.json(json);
  }
  else {
    let json = {
      success : true,
      nickName
    };
    userList.push(nickName);
    res.json(json);
  }
});
export default router;