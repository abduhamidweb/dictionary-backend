var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Word from '../schemas/word.schema.js';
import Unit from '../schemas/unit.schema.js';
class WordController {
    createWord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { engWord, uzbWord, transcription, role, info, message, unitId, imgLink } = req.body;
            try {
                const word = new Word({ engWord, uzbWord, transcription, role, info, message, unitId, imgLink });
                yield word.save();
                yield Unit.findByIdAndUpdate(unitId, {
                    $push: {
                        words: word._id
                    }
                });
                res.status(201).json(word);
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    getAllWords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const words = yield Word.find();
                res.status(200).json(words);
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    getWordById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const word = yield Word.findById(id);
                if (!word) {
                    res.status(404).json({ error: 'Word not found' });
                    return;
                }
                res.status(200).json(word);
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    updateWord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { engWord, uzbWord, transcription, role, info, message, unitId, imgLink } = req.body;
            try {
                const word = yield Word.findByIdAndUpdate(id, { engWord, uzbWord, transcription, role, info, message, unitId, imgLink }, { new: true }).populate('unitId');
                if (!word) {
                    res.status(404).json({ error: 'Word not found' });
                    return;
                }
                res.status(200).json(word);
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    deleteWord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const word = yield Word.findByIdAndDelete(id);
                if (!word) {
                    res.status(404).json({ error: 'Word not found' });
                    return;
                }
                res.status(204).send(word);
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
}
export default new WordController();
