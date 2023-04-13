const {Case} = require('../models')
const path = require('path')
const uuid = require('uuid')
const {where} = require("sequelize");
const fs = require('fs')

function unlinkCallback(err) {
    if(err && err.code === 'ENOENT') {
        // file doens't exist
        console.info("File doesn't exist, won't remove it.");
    } else if (err) {
        // other errors, e.g. maybe we don't have enough permission
        console.error("Error occurred while trying to remove file");
    } else {
        console.info(`removed`);
    }
}
class CasesController {
    //For everyone
    async fetchAll(req, res) {
        const cases = await Case.findAll({where: {status: 'active'}})
        return res.json(cases)
    }
    async fetchOne(req, res) {
        const {caseId} = req.params
        const cases = await Case.findOne({where: {id: caseId, status: 'active'}})
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
    async deleteCase(req, res) {
        const {caseId} = req.params
        const cases = await Case.findOne({where: {id: caseId}})
        await fs.unlink(path.resolve(__dirname, '..', 'static', 'logos', cases.logo), (err) => {
            err ? console.log(err) : console.log('logo deleted')
        })
        await fs.unlink(path.resolve(__dirname, '..', 'static', 'presentations', cases.presentation), (err) => {
            err ? console.log(err) : console.log('presentation deleted')
        })
        await cases.destroy()
        return res.json(cases)
    }
    async archiveCase(req, res){
        const {caseId} = req.params
        const archivedCase = await Case.findOne({where: {id: caseId}})
        if (archivedCase.status === 'on_moderation') {
            return res.status(403).json({message: 'Кейс на модерации'})
        }
        await archivedCase.update({status: 'archived'})
        return res.json(archivedCase)
    }
    async activateCase(req, res) {
        const {caseId} = req.params
        const activeCase = await Case.findOne({where: {id: caseId}})
        if (activeCase.status === 'on_moderation') {
            return res.status(403).json({message: 'Кейс на модерации'})
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
        const {caseId} = req.params
        const moderatedCase = await Case.findOne({where: {id: caseId}})
        await moderatedCase.update({status: 'approved'})
        return res.json(moderatedCase)
    }
}

module.exports = new CasesController()