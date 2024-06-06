const Router = require('express')
const router = new Router()
const bookController = require('../controllers/bookController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/',checkRole('ADMIN'), bookController.create)
router.get('/',bookController.getAll)
router.get('/:id',bookController.getOne)
router.get('/byId',bookController.getAllById)
router.post('/notAvailable',bookController.postOneTrue)
router.post('/available',bookController.postOneFalse)
router.get('/?isA=false', bookController.getAllUnavailable)

module.exports = router