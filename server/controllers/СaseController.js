const {Case} = require('../models')
const path = require('path')
const uuid = require('uuid')
class CasesController {
    //For everyone
    async fetchAll(req, res) {
        const cases = await Case.findAll({where: {status: 'active'}})
        return res.json(cases)
    }

    //For companies
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
    async archiveCase(req, res){
        const {caseId} = req.query
        const archivedCase = await Case.findOne({where: {id: caseId}})
        if (archivedCase.status === 'on_moderation') {
            return res.status(401).json({message: 'Кейс на модерации'})
        }
        await archivedCase.update({status: 'archived'})
        return res.json(archivedCase)
    }
    async activateCase(req, res) {
        const {caseId} = req.query
        const activeCase = await Case.findOne({where: {id: caseId}})
        if (activeCase.status === 'on_moderation') {
            return res.status(401).json({message: 'Кейс на модерации'})
        }
        await activeCase.update({status: 'active'})
        return res.json(activeCase)
    }
    //For admins
    async fetchModeratedCases(req, res) {
        const cases = await Case.findAll({where: {status: 'on_moderation'}})
        return res.json(cases)
    }
    async approveCase(req, res) {
        const {caseId} = req.query
        const moderatedCase = await Case.findOne({where: {id: caseId}})
        await moderatedCase.update({status: 'approved'})
        return res.json(moderatedCase)
    }
}

module.exports = new CasesController()