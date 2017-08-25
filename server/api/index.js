import { Router } from 'express';

import user from './user';
import room from './room';
var router = Router();

// Add USERS Routes
router.use(user);
router.use(room);

export default router;
