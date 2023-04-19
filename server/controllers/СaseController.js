const CaseService = require('../services/CaseService')

class CasesController {
    //For everyone
    async fetchAll(req, res) {
        const cases = await CaseService.fetchAll()
        return res.json(cases)
    }
    async fetchOne(req, res, next) {
        try {
            const {caseId} = req.params
            const cases = await CaseService.fetchOne(caseId)
            return res.json(cases)
        } catch (e) {
            next(e)
        }
    }

    //For companies
    async addCase(req, res) {
        const {name, description} = req.body
        const {id} = req.user
        const {logo, presentation} = req.files
        const cases = await CaseService.addCase(name, description, id, logo, presentation)
        return res.json(cases)
    }
    async deleteCase(req, res, next) {
        try {
            const {caseId} = req.params
            const cases = await CaseService.deleteCase(caseId)
            return res.json(cases)
        } catch (e) {
            next(e)
        }
    }
    async archiveCase(req, res, next){
        try {
            const {caseId} = req.params
            const archivedCase = await CaseService.archiveCase(caseId)
            return res.json(archivedCase)
        } catch (e) {
            next(e)
        }
    }
    async activateCase(req, res, next) {
        try {
            const {caseId} = req.params
            const activeCase = await CaseService.activateCase(caseId)
            return res.json(activeCase)
        } catch (e) {
            next(e)
        }
    }
    //For admins
    async fetchModeratedCases(req, res) {
        const cases = await CaseService.fetchModeratedCases()
        return res.json(cases)
    }
    async approveCase(req, res, next) {
        try {
            const {caseId} = req.params
            const moderatedCase = await CaseService.approveCase(caseId)
            return res.json(moderatedCase)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new CasesController()