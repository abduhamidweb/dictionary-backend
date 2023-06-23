import express from 'express';
import wordController from '../controllers/word.contr.js';

const router = express.Router();

router.post('/', wordController.createWord.bind(wordController));
router.get('/', wordController.getAllWords.bind(wordController));
router.get('/:id', wordController.getWordById.bind(wordController));
router.put('/:id', wordController.updateWord.bind(wordController));
router.delete('/:id', wordController.deleteWord.bind(wordController));

export default router;
