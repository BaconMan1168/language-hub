import { Router } from 'express'
import contributionController from '../controllers/contributionController.js'
const contributionRouter = Router();


contributionRouter.get('/', contributionController.getUserContributions)
contributionRouter.post('/', contributionController.contributeTranslation)
contributionRouter.patch('/:translationId/missing-fields', contributionController.completeMissingTranslationFields)

export default contributionRouter
