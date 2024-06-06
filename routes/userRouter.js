const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration',userController.registration)
router.post('/login',userController.login)
router.get('/auth', authMiddleware, userController.check)
router.get('/all',userController.getAllMembers)
router.get('/one',userController.getOneMember)
router.post('/del',userController.deleteUser)
router.post('/toAdmin',userController.updateUsertoADMIN)
router.post('/toUser',userController.updateUserToUSER)
router.post('/toTrue',userController.updateSubscriptionToTrue)
router.post('/toFalse',userController.updateSubscriptionToFalse)

module.exports = router