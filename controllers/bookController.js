const uuid = require('uuid')
const path = require('path')
const { Book, Basket } = require('../models/models')
const ApiError = require('../Errors/ApiError')
const { Op } = require("sequelize");
const fs = require('fs/promises');


class BookController {
    async create(req, res, next) {
        try {
            const { name, author, year, genreId, desc } = req.body
            const { img, pdf } = req.files;
            let fileName = uuid.v4() + ".jpg"
            const book = await Book.create({ name, author, year, genreId, desc, img: fileName })

            try {
                const newPath = path.resolve(__dirname, '..', './static', `./${ book.id }`);
                await fs.mkdir(newPath);
                await img.mv(path.resolve(__dirname, '..', 'static', fileName))
                await pdf.mv(path.resolve(__dirname, '..', './static', `./${ book.id }`, `book.pdf`))
            } catch (e) {
                console.log(e)
            }

            return res.json(book)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async getAll(req, res) {
        let { searchString, genreId, limit, page } = req.query
        page = page || 1
        limit = limit || 6
        let offset = page * limit - limit
        let book;

        const where = {}
        if (genreId) {
            where.genreId = genreId
        }
        if (searchString) {
            where.author = {
                [Op.iLike]: `%${ searchString }%`
            };
            where.name = {
                [Op.iLike]: `%${ searchString }%`
            };
        }

        book = await Book.findAndCountAll({ where, limit, offset })
        return res.json(book)

    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params
            const book = await Book.findOne({ where: { id } })
            return res.json(book)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAllById(req, res) {
        const { id } = req.query
        const book = await Book.findAll({ where: { id } })
        return res.json(book)
    }

    async postOneFalse(req, res) {
        const { id } = req.body
        const book = await Book.update({
            isA: false
        }, {
            where: { id }
        })
        return res.json(book)
    }

    async postOneTrue(req, res) {
        const { id } = req.body
        const book = await Book.update({
            isA: true
        }, {
            where: { id }
        })
        return res.json(book)
    }

    async getAllUnavailable(req, res) {
        const book = await Book.findAll({ where: { isA: false } })
        return res.json(book)
    }

}

module.exports = new BookController()
