import { Router } from 'express';
import { roomList } from '../memorydb';
var router = Router();

router.get('/roomlist', function(req, res){
  res.json(roomList);
});

export default router;