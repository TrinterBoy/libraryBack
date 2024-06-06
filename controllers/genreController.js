const {Genre, Book} = require('../models/models')
const ApiError = require('../Errors/ApiError')

class GenreController {
    async create(req,res){
        const {name} =req.body
        const genre = await Genre.create({name})
        return res.json(genre)
    }
    async getAll(req,res){
        const genres = await Genre.findAll()
        return res.json(genres)
    }
    async getOne(req,res){
        const {id} = req.params
        const genres = await Genre.findOne({where:{id}})
        return res.json(genres)
    }
}

module.exports = new GenreController()
