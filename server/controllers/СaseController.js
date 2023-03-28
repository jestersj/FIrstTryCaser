const {Case, StartedCases} = require('../models')
const path = require('path')
const uuid = require('uuid')
class CasesController {
    async fetchAll(req, res) {
        const cases = await Case.findAll()
        return res.json(cases)
    }
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
}

module.exports = new CasesController()