const Case = require("../models/index").case;
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const ApiError = require('../errors/ApiError')

class CaseService {
    async fetchAll() {
        return await Case.findAll({where: {status: 'active'}})
    }
    async fetchOne(caseId) {
        const cases = await Case.findOne({where: {id: caseId, status: 'active'}})
        if (!cases) {
            throw ApiError.notFound('Кейс не найден')
        }
        return cases
    }
    async addCase(name, description, id, logo, presentation) {
        let logoName = uuid.v4() + '.jpg'
        let presName = uuid.v4() + '.pdf'
        await logo.mv(path.resolve(__dirname, '..', 'static', 'logos', logoName))
        await presentation.mv(path.resolve(__dirname, '..', 'static', 'presentations', presName))
        return await Case.create({name, description, logo: logoName, presentation: presName, userId: id})
    }
    async deleteCase(caseId) {
        const cases = await Case.findOne({where: {id: caseId}})
        if (!cases) {
            throw ApiError.notFound('Кейс не найден')
        }
        await fs.unlink(path.resolve(__dirname, '..', 'static', 'logos', cases.logo), (err) => {
            err ? console.log(err) : console.log('logo deleted')
        })
        await fs.unlink(path.resolve(__dirname, '..', 'static', 'presentations', cases.presentation), (err) => {
            err ? console.log(err) : console.log('presentation deleted')
        })
        await cases.destroy()
        return cases
    }
    async archiveCase(caseId) {
        const archivedCase = await Case.findOne({where: {id: caseId}})
        if (!archivedCase) {
            throw ApiError.notFound('Кейс не найден')
        }
        if (archivedCase.status === 'on_moderation') {
            throw ApiError.forbidden('Кейс на модерации')
        }
        await archivedCase.update({status: 'archived'})
        return archivedCase
    }
    async activateCase(caseId) {
        const activeCase = await Case.findOne({where: {id: caseId}})
        if (!activeCase) {
            throw ApiError.notFound('Кейс не найден')
        }
        if (activeCase.status === 'on_moderation') {
            throw ApiError.forbidden('Кейс на модерации')
        }
        await activeCase.update({status: 'active'})
        return activeCase
    }
    async fetchModeratedCases() {
        return await Case.findAll({where: {status: 'on_moderation'}})
    }
    async approveCase(caseId) {
        const moderatedCase = await Case.findOne({where: {id: caseId}})
        if (!moderatedCase) {
            throw ApiError.notFound('Кейс не найден')
        }
        await moderatedCase.update({status: 'approved'})
        return moderatedCase
    }
}

module.exports = new CaseService()