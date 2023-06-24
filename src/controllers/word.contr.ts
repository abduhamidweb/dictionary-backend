import { Request, Response } from 'express';
import Word from '../schemas/word.schema.js';
import { IWord } from '../interface/interface';
import Unit from '../schemas/unit.schema.js';

class WordController {
    public async createWord(req: Request, res: Response): Promise<void> {
        const { engWord, uzbWord, transcription, role, info, message, unitId, imgLink }: IWord = req.body;
        try {
            const word = new Word({ engWord, uzbWord, transcription, role, info, message, unitId, imgLink });
            await word.save();
            await Unit.findByIdAndUpdate(unitId, {
                $push: {
                    words: word._id
                }
            });
            res.status(201).json(word);
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    public async getAllWords(req: Request, res: Response): Promise<void> {
        try {
            const words: IWord[] | null = await Word.find();

            res.status(200).json(words);
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    public async getWordById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            const word: IWord | null = await Word.findById(id);

            if (!word) {
                res.status(404).json({ error: 'Word not found' });
                return;
            }

            res.status(200).json(word);
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    public async updateWord(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { engWord, uzbWord, transcription, role, info, message, unitId, imgLink }: IWord = req.body;

        try {
            const word = await Word.findByIdAndUpdate(id, { engWord, uzbWord, transcription, role, info, message, unitId, imgLink }, { new: true }).populate('unitId');

            if (!word) {
                res.status(404).json({ error: 'Word not found' });
                return;
            }
            res.status(200).json(word);
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    public async deleteWord(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            const word: IWord | null = await Word.findByIdAndDelete(id);

            if (!word) {
                res.status(404).json({ error: 'Word not found' });
                return;
            }

            res.status(204).send(word);
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }
}

export default new WordController();
