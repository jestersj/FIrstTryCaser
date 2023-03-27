const {Case} = require('../models')
const path = require('path')
const uuid = require('uuid')
class CasesController {
    async fetchAll(req, res) {
        const cases = await Case.findAll()
        return res.json(cases)
    }
    async addCase(req, res) {
        const {name, description} = req.body
        const {id} = req.user
        const {logo, presentation} = req.files
        let logoName = uuid.v4() + '.jpg'
        let presName = uuid.v4() + '.pdf'
        await logo.mv(path.resolve(__dirname, '..', 'static', 'logos', logoName))
        await presentation.mv(path.resolve(__dirname, '..', 'static', 'presentations', presName))
        const cases = await Case.create({name, description, logo: logoName, presentation: presName, userId: id})
        return res.json(cases)
    }
}

module.exports = new CasesController()