import { Request, Response } from 'express';
import Book from '../schemas/book.schema.js';
import Unit from '../schemas/unit.schema.js';
class EndController {
    public async end(req: Request, res: Response) {
        let data = req.body;
        try {
            // Teng kelgan so'zlarni JSON formatida javob qiling
            // res.send(matchingWords);
            interface DataItem {
                _id: string;
                engWord: string;
                uzbWord: string;
                unitId: string;
                variants: string[];
                inFact: string;
                question: string;
                role: string;
                answer?: string;
            }
            function processItems(data: DataItem[]): {
                correct: DataItem[];
                incorrect: DataItem[];
                error: DataItem[];
            } {
                const correct: DataItem[] = [];
                const incorrect: DataItem[] = [];
                const error: DataItem[] = [];

                for (const item of data) {
                    if (item.inFact === item.answer) {
                        correct.push(item);
                    } else if (item.answer) {
                        incorrect.push(item);
                    } else {
                        error.push(item);
                    }
                }
                return { correct, incorrect, error };
            }
            const result = processItems(data);
            // console.log(result.correct.find(obj => obj._id)?._id);
            // let bookId = await Unit.find({ _id:  })
            // console.log('bookId :', bookId);
            res.send({
                correct: result.correct,
                incorrect: result.incorrect
            })
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }
}
export default new EndController();  