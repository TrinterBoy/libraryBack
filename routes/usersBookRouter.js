const Router = require('express')
const router = new Router()
const usersBookController=require('../controllers/usersBookController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/',authMiddleware,usersBookController.create)
router.get('/',authMiddleware,usersBookController.getAllId)
router.post('/del',authMiddleware,usersBookController.delUsersBook)

module.exports = router