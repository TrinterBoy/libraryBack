const Router = require('express')
const router = new Router()
const bookRouter = require('./bookRouter')
const userRouter = require('./userRouter')
const genreRouter = require('./genreRouter')
const basketRouter = require('./basketRouter')
const usersBookRouter = require('./usersBookRouter')


router.use('/user', userRouter)
router.use('/book', bookRouter)
router.use('/genre', genreRouter)
router.use('/basket', basketRouter)
router.use('/usersBook', usersBookRouter)


module.exports = router