import { Request, Response } from 'express';
import Book from '../schemas/book.schema.js';
import Unit from '../schemas/unit.schema.js';
import { JWT } from '../utils/jwt.js';
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

interface ResultItem {
    count: number;
    words: DataItem[];
}

interface Result {
    correct: ResultItem;
    incorrect: ResultItem;
}
class EndController {
    public async end(req: Request, res: Response) {
        let data = req.body;
        let token: any = req.headers.token;
        let userId = JWT.VERIFY(token).id;
        try {
            function processItems(data: DataItem[]): {
                correct: DataItem[];
                incorrect: DataItem[];
                error: DataItem[];
            } {
                const correct: ResultItem = { count: 0, words: [] };
                const incorrect: ResultItem = { count: 0, words: [] };
                const error: DataItem[] = [];
                for (const item of data) {
                    if (item.inFact == item.answer) {
                        correct.count++;
                        correct.words.push(item);
                    } else if (item.answer) {
                        incorrect.count++;
                        incorrect.words.push(item);
                    } else {
                        error.push(item);
                    }
                }
                let correctWords = correct.words;
                let incorrectWords = incorrect.words;

                return { correct: correctWords, incorrect: incorrectWords, error };
            }
            const result = processItems(data);
            const unitIds = [
                ...new Set([
                    ...result.correct.map((item) => item.unitId),
                    ...result.incorrect.map((item) => item.unitId),
                ]), 
            ];
            const books = await Book.find();
            console.log(books.filter((book) =>
                book.units.some((unitId) => unitIds.includes(unitId.toString()))
            )); 

            res.send({
                correct: result.correct,
                incorrect: result.incorrect,
                errorRes: result.error
            })
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }
}
export default new EndController();  

// import { Request, Response } from 'express';
// import Book from '../schemas/book.schema.js';
// import Unit from '../schemas/unit.schema.js';
// import mongoose from 'mongoose';

// interface DataItem {
//     _id: string;
//     engWord: string;
//     uzbWord: string;
//     unitId: string;
//     variants: string[];
//     inFact: string;
//     question: string;
//     role: string;
//     answer?: string;
// }

// interface ResultItem {
//     count: number;
//     words: DataItem[];
// }

// interface Result {
//     correct: ResultItem;
//     incorrect: ResultItem;
// }

// class EndController {
//     public async end(req: Request, res: Response) {
//         const { token } = req.headers;
//         const { id: userId } = jwt.verify(token, process.env.JWT_SECRET);

//         let data = req.body;
//         try {
//             function processItems(data: DataItem[]): Result {
//                 const correct: ResultItem = { count: 0, words: [] };
//                 const incorrect: ResultItem = { count: 0, words: [] };

//                 for (const item of data) {
//                     if (item.inFact == item.answer) {
//                         correct.count++;
//                         correct.words.push(item);
//                     } else if (item.answer) {
//                         incorrect.count++;
//                         incorrect.words.push(item);
//                     }
//                 }

//                 return { correct, incorrect };
//             }

//             const result = processItems(data);

//             const bookIds = [
//                 ...new Set([
//                     ...result.correct.words.map((item) => item.unitId),
//                     ...result.incorrect.words.map((item) => item.unitId),
//                 ]),
//             ];

//             const books = await Book.find({
//                 unitId: { $in: bookIds.map((id) => mongoose.Types.ObjectId(id)) },
//             });

//             const correctWords = result.correct.words.map((word) => {
//                 return { ...word, userId };
//             });

//             const incorrectWords = result.incorrect.words.map((word) => {
//                 return { ...word, userId };
//             });

//             const schema = new mongoose.Schema({
//                 userId: String,
//                 wordId: String,
//                 unitId: String,
//                 engWord: String,
//                 uzbWord: String,
//                 question: String,
//                 role: String,
//             });

//             const CorrectModel = mongoose.model('Correct', schema, 'correct');
//             const IncorrectModel = mongoose.model(
//                 'Incorrect',
//                 schema,
//                 'incorrect'
//             );

//             await CorrectModel.insertMany(
//                 correctWords.map((word) => {
//                     const book = books.find((b) => b.unitId == word.unitId);
//                     return {
//                         userId: word.userId,
//                         wordId: word._id,
//                         unitId: word.unitId,
//                         engWord: word.engWord,
//                         uzbWord: word.uzbWord,
//                         question: word.question,
//                         role: word.role,
//                         bookName: book?.name || '',
//                     };
//                 })
//             );

//             await IncorrectModel.insertMany(
//                 incorrectWords.map((word) => {
//                     const book = books.find((b) => b.unitId == word.unitId);
//                     return {
//                         userId: word.userId,
//                         wordId: word._id,
//                         unitId: word.unitId,
//                         engWord: word.engWord,
//                         uzbWord: word.uzbWord,
//                         question: word.question,
//                         role: word.role,
//                         bookName: book?.name || '',
//                     };
//                 })
//             );

//             res.send({
//                 correct: result.correct,
//                 incorrect: result.incorrect,
//             });
//         } catch (error: unknown) {
//             res.status(500).json({ success: false, error: (error as Error).message });
//         }
//     }
// }

// export default new EndController();