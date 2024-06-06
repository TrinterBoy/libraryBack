const {UsersBook} = require("../models/models");


class UsersBookController {
    async create(req,res){
        const {userId,bookId} =req.body
        const basket = await UsersBook.create({userId,bookId})
        return res.json(basket)
    }
    async getAllId(req,res){
        const {userId} =req.query
        let basket
        if(userId) {
             basket = await UsersBook.findAll({where: {userId}})
        }
        else{
             basket = await UsersBook.findAll()
        }
        return res.json(basket)
    }
    async delUsersBook(req,res){
        const {userId,bookId} =req.body
            const basket = await UsersBook.destroy({where:{userId,bookId}})
        return res.json(basket)
    }

}

module.exports = new UsersBookController()
