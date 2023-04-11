const {Solution, Case} = require('../models')
const path = require('path')
const uuid = require('uuid')

class SolutionController {
    async fetchSolutions(req, res) {
        const {id} = req.user
        const solutions = await Solution.findAll({where: {userId: id}})
        const casesId = []
        solutions.forEach(el => casesId.push(el.caseId))
        const result = []
        for (const el of casesId) {
            result.push(await Case.findOne({where: {id: el}}))
        }
        return res.json(result)
    }
    async startSolution(req, res) {
        const userId = req.user.id
        const {caseId} = req.params
        const solution = await Solution.create({caseId, userId})
        return res.json(solution)
    }
    async finishSolution(req, res) {
        const userId = req.user.id
        const {caseId} = req.params
        const {annotation} = req.body
        const {presentation} = req.files
        let presName = uuid.v4() + '.pdf'
        await presentation.mv(path.resolve(__dirname, '..', 'static', 'solutions', presName))
        const solution = await Solution.findOne({where: {userId, caseId}})
        await solution.update({annotation, presentation: presName, status: 'solved'})
        return res.json(solution)
    }
}

module.exports = new SolutionController()