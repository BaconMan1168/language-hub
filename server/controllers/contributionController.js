import auth from '../middleware/auth.js'
import contributeService from '../services/contributeService.js'
import { body, matchedData } from 'express-validator' 
import prisma from '../prisma.js'
import validationErrorCheck from '../middleware/expressValidate.js'

const validateContribution = [
    body('wordText').notEmpty()
        .trim(),
    body('englishDefinition').notEmpty()
        .trim(),
    body('exampleSentence')
        .optional({ checkFalsy: true })
        .trim(),
    body('audioUrl') 
        .optional({ checkFalsy: true })
        .trim(),
    body('languageId').notEmpty()
        .custom(async id => {
            const language = await prisma.language.findUnique({
                where: { id }
            })
            
            if (!language) throw new Error('Language does not exist')
        }),
    body('partOfSpeech')
        .optional({ checkFalsy: true })
        .trim(),
    body('usageComment')
        .optional({ checkFalsy: true })
        .trim()
]

const contributeTranslation = [
    auth,
    validateContribution,
    validationErrorCheck,
    async (req, res, next) => {
        const { id } = req.user
        const translationData = matchedData(req);

        try {
            // translationData now includes audioUrl
            const contributedTranslation = await contributeService.contributeTranslation(id, translationData)

            res.status(201).json(contributedTranslation)
        }
        catch (err) {
            next(err)
        }
    }
]

const completeMissingTranslationFields = [
    auth,
    async (req, res, next) => {
        const { id: userId } = req.user;
        const { translationId } = req.params;

        try {
            const updatedTranslation = await contributeService.completeMissingTranslationFields(
                userId,
                translationId,
                req.body
            );

            res.status(200).json(updatedTranslation);
        } catch (err) {
            if (err.message === 'Translation does not exist') {
                return res.status(404).json({ message: err.message });
            }

            if (err.message === 'No missing fields were provided' || err.code === 'P2025') {
                return res.status(409).json({
                    message: 'These fields have already been completed. Refresh and try again.'
                });
            }

            next(err);
        }
    }
]

const getUserContributions = [
    auth,
    async (req, res, next) => {
        const { id } = req.user
        const { page = 1, limit = 20 } = req.query

        try {
            const contributions = await contributeService.getUserContributions(id, Number(page), Number(limit));

            res.status(200).json(contributions)
        }
        catch (err) {
            next(err)
        }
    }
]


const contributionController = {
    contributeTranslation,
    completeMissingTranslationFields,
    getUserContributions
}

export default contributionController
