const {Appeal} = require('../models')
class AppealController {
    async fetchAll(req, res) {
        const appeals = await Appeal.findAll()
        return res.json(appeals)
    }
    async fetchOne(req, res) {
        const {id} = req.params
        const appeal = await Appeal.findOne({where: {id}})
        return res.json(appeal)
    }
    async createAppeal(req, res) {
        const data = req.body
        const appeal = await Appeal.create({
            name: data.name,
            typeOfUser: data.typeOfUser,
            phone: data.phone,
            tg: data.tg,
            communication: data.communication,
            description: data.description
        })
        return res.json(appeal)
    }
}

module.exports = new AppealController()