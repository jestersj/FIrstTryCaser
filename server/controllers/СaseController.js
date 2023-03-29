const {Case, StartedCases} = require('../models')
const path = require('path')
const uuid = require('uuid')
class CasesController {
    //For everyone
    async fetchAll(req, res) {
        const cases = await Case.findAll({where: {status: 'active'}})
        return res.json(cases)
    }
    //For users
    async fetchStartedCases(req, res) {
        const {id} = req.user
        const startedCases = await StartedCases.findAll({where: {userId: id}})
        const casesId = []
        startedCases.forEach(el => casesId.push(el.caseId))
        const result = []
        for (const el of casesId) {
            result.push(await Case.findOne({where: {id: el}}))
        }
        return res.json(result)
    }
    async startCase(req, res) {
        const userId = req.user.id
        const {caseId} = req.query
        const startedCase = await StartedCases.create({caseId, userId})
        return res.json(startedCase)
    }
    async finishCase(req, res) {
        const userId = req.user.id
        const {caseId} = req.query
        const finishedCase = await StartedCases.findOne({where: {caseId, userId}})
        await finishedCase.update({status: 'finished'})
        return res.json(finishedCase)
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
        const cases = await Case.create({name, description, logo: logoName, presentation: presName, author: id})
        return res.json(cases)
    }
    async archiveCase(req, res){
        const {caseId} = req.query
        const archivedCase = await Case.findOne({where: {caseId}})
        if (archivedCase.status === 'on_moderation') {
            return res.status(401).json({message: 'Кейс на модерации'})
        }
        await archivedCase.update({status: 'archived'})
        return res.json(archivedCase)
    }
    async activateCase(req, res) {
        const {caseId} = req.query
        const activeCase = await Case.findOne({where: {caseId}})
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
        const moderatedCase = await Case.findOne({where: {caseId}})
        await moderatedCase.update({status: 'ready'})
        return res.json(moderatedCase)

    }
}

module.exports = new CasesController()