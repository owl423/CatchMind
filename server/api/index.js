import { Router } from 'express'

import users from './users'
import username from './username'

var router = Router()

// Add USERS Routes
router.use(users)
router.use(username)

export default router
