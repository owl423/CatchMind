import { Router } from 'express'

var router = Router()

let userList = []

router.get('/nickname', function(req, res){
  // console.log('res: ', res);
  res.json(userList);
})
router.post('/nickname', function(req, res){
  let nickName = req.body.nickName;
  let isDuplicate = false;
  // 닉네임 중복여부 확인
  userList.forEach((user) => {
    if(user === nickName){
      isDuplicate = true;
    }
  })
  // 중복이 됐다면
  if(isDuplicate) {
    let json = {
      success : false,
      nickName : '',
    }
    res.json(json);
  }
  else {
    let json = {
      success : true,
      nickName
    }
    userList.push(nickName);
    res.json(json);
  }
})
export default router