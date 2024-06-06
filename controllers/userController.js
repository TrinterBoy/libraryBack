const ApiError = require('../Errors/ApiError')
const bcrypt =require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket, Book} = require('../models/models')

class UserController {
    async registration(req,res,next){
        const {name,surname,email,password,phone,subscription,role} = req.body
        const regular = /[^a-zа-яёіїє'ґ]/i
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
        if(name.match(regular)) {
            return next(ApiError.badRequest("Некорктне ім'я"))
        }
        if(surname.match(regular)) {
            return next(ApiError.badRequest(`Некорктна фамілія`))
        }
        if(!name|| name.length<2) {
            return next(ApiError.badRequest("Некорктне ім'я"))
        }
        if(!surname|| surname.length<2) {
            return next(ApiError.badRequest(`Некорктна фамілія`))
        }
        if(!email.match(re)) {
            return next(ApiError.badRequest("Некорктний email"))
        }
        if(!email || !password) {
            return next(ApiError.badRequest("Відсутній email, чи пароль"))
        }
        const phone2 = await User.findOne({where:{phone}})
        if(phone2){
            return next(ApiError.badRequest("Такий телефон вже зареєстрований"))
        }
        const candid = await User.findOne({where:{email}})
        console.log(phone)
        if (phone.length != 9 ){
            try{
                Number(phone)
            }catch (e){
                return next(ApiError.badRequest("Невірно вказаний  номер"))
            }
            return next(ApiError.badRequest("Невірно вказаний  номер"))
        }
        if (candid){
            return next(ApiError.badRequest("Користувач з таким email уже існує"))
        }
        const hashedpassword = await bcrypt.hash(password, 5)
        const user = await User.create({name,surname,email,password:hashedpassword,phone,subscription,role})
        await Basket.create({userId:user.id})
        const token = jwt.sign({id:user.id,surname:user.surname, email: user.email,phone:user.phone, name: user.name,subscription:user.subscription,role:user.role}, process.env.SECRET_KEY,{expiresIn: '24h'})
        return res.json({token})
    }

    async login(req,res,next){
        const {email,password} = req.body
        const user = await User.findOne({where: {email}})
        if(!user){
            return next(ApiError.internal("Невірний email"))
        }
        let pass = bcrypt.compareSync(password,user.password)
        if(!pass){
            return next(ApiError.internal("Невірний пароль"))
        }
        const token = jwt.sign({id:user.id,surname:user.surname, email: user.email,phone:user.phone, name: user.name,subscription:user.subscription,role:user.role}, process.env.SECRET_KEY,{expiresIn: '24h'})
        return res.json({token})
    }
    async check(req,res,next){
        const token  = jwt.sign({id:req.user.id,surname:req.user.surname, email: req.user.email,phone:req.user.phone, name: req.user.name,subscription:req.user.subscription,role:req.user.role}, process.env.SECRET_KEY,{expiresIn: '24h'})
        return res.json({token})
    }
    async getOneMember(req,res){
        const {id} = req.query
        const user = await User.findOne({where:{id}})
        return res.json(user)
    }
    async getAllMembers(req,res){
        const user = await User.findAll()
        return res.json(user)
    }
    async deleteUser(req,res){
        const {id} = req.body
        const user = await User.destroy({where:{id}})
        return res.json(user)
    }
    async updateUsertoADMIN(req,res){
        const {id} = req.body
        const user = await User.update({role:"ADMIN"},{where:{id}})
        return res.json(user)
    }
    async updateUserToUSER(req,res){
        const {id} = req.body
        const user = await User.update({role:"USER"},{where:{id}})
        return res.json(user)
    }
    async updateSubscriptionToTrue(req,res){
        const {id} = req.body
        const user = await User.update({subscription:true},{where:{id}})
        return res.json(user)
    }
    async updateSubscriptionToFalse(req,res){
        const {id} = req.body
        const user = await User.update({subscription:false},{where:{id}})
        return res.json(user)
    }
}

module.exports = new UserController()
