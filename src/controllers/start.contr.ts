import { Request, Response } from 'express';
import Book from '../schemas/book.schema.js';
import Unit from '../schemas/unit.schema.js';
import Word from '../schemas/word.schema.js';

class StartController {
    public async start(req: Request, res: Response) {
        const { booksId, unitsId, wordCount } = req.body;
        try {
            // req.body bo'lishi shart.
            if (!booksId) {
                throw new Error("booksId is required");
            }

            if (!unitsId) {
                throw new Error("unitsId is required");
            }

            if (!wordCount) {
                throw new Error("wordCount is required");
            }
            if (!Array.isArray(booksId) || !Array.isArray(unitsId) || typeof wordCount !== "number") {
                throw new Error("Invalid request body");
            }
            // Kitoblarni, unitlarni va so'zlarni topish uchun funksiyalarni chaqiring
            const foundBooks = await findBooksByIds(booksId);
            const matchingUnits =await findUnitsByBookIdsAndUnitIds(foundBooks, unitsId);
            const matchingWords =await findWordsByUnitIdsAndWordCount( matchingUnits, wordCount);

            // Teng kelgan so'zlarni JSON formatida javob qiling
            res.json(matchingWords);

        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }
}
export default new StartController();
// Kitoblarni IDlariga ko'ra qidiruv
async function findBooksByIds(bookIds: any) {
    const books = await Book.find();
    return books.filter(book => bookIds.includes(book._id.toString()));
}

async function findUnitsByBookIdsAndUnitIds(books: any, unitIds: any) {
    const matchingUnits = [];
    for (const book of books) {
        for (const unitId of book.units) {
            if (unitIds.includes(unitId.toString())) {
                const units = await Unit.find();
                const matchingUnit = units.find(unit => unit._id.toString() == unitId.toString());
                if (matchingUnit) {
                    matchingUnits.push(matchingUnit);
                }
            }
        }
    }
    return matchingUnits;
}

async function findWordsByUnitIdsAndWordCount(units: any[], wordCount: any) {
    const words = await Word.find();
    return await units.reduce(async (matchingWords: any[], unit: any) => {
        const unitWords = words.filter((word: any) => unit.words.includes(word._id));
        const slicedWords = unitWords.slice(0, wordCount);
        return (await matchingWords).concat(slicedWords);
    }, []);

}

