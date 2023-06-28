import { Request, Response } from 'express';
import Book from '../schemas/book.schema.js';
import Unit from '../schemas/unit.schema.js';
import Word from '../schemas/word.schema.js';
import { shuffleArray } from '../utils/shuffle.js';

class StartController {
    public async start(req: Request, res: Response) {
        const { booksId, unitsId, wordCount, sort } = req.body;
        try {
            // req.body bo'lishi shart.
            if (!booksId) {
                throw new Error("booksId is required");
            }
            if (!sort) {
                throw new Error("sort is required");
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
            const matchingUnits = await findUnitsByBookIdsAndUnitIds(foundBooks, unitsId);
            const matchingWords = await findWordsByUnitIdsAndWordCount(matchingUnits, wordCount, sort);

            // Teng kelgan so'zlarni JSON formatida javob qiling
            res.send(matchingWords);

        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }
}
export default new StartController();
// Kitoblarni IDlariga ko'ra qidiruv ---
async function findBooksByIds(bookIds: any) {
    const books = await Book.find();
    return books.filter((book: any) => bookIds.includes(book._id.toString()));
}
async function findUnitsByBookIdsAndUnitIds(books: any[], unitIds: any[]) {
    const matchingUnits: any[] = [];
    for (const book of books) {
        for (const unitId of book.units) {
            if (unitIds.includes(unitId.toString())) {
                const units = await Unit.find();
                const matchingUnit = units.find((unit: any) => unit._id.toString() === unitId.toString());
                if (matchingUnit) {
                    matchingUnits.push(matchingUnit);
                }
            }
        }
    }
    return matchingUnits;
}
async function findWordsByUnitIdsAndWordCount(units: any[], wordCount: number, sort:string) {
    const words = await Word.find();
    const matchingWords: any[] = [];
    for (const unit of units) {
        const unitWords = words.filter((word: any) => unit.words.includes(word._id));

        matchingWords.push(...unitWords);
    }
    const rearrangedArray = matchingWords.map(item => {
        return {
            "_id": item._id,
            "engWord": item.engWord,
            "uzbWord": item.uzbWord,
            "unitId": item.unitId
        };
    });
    function mergeWords(data: any) {
        let engWords = [];
        let uzbWords = [];

        for (let i = 0; i < data.length; i++) {
            engWords.push(data[i].engWord);
            uzbWords.push(data[i].uzbWord);
        }

        return { engWords, uzbWords };
    }

    let shuffledArray = shuffleArray(rearrangedArray, wordCount)
    const { engWords, uzbWords } = mergeWords(rearrangedArray);
    // Uzbekcha test
    let addedVariantsUzb = shuffledArray.map((obj) => {
        return { ...obj, variants: shuffleArray(uzbWords, 3) };
    });
    let filterUzbWords = addedVariantsUzb.map((obj) => {
        obj.variants.push(obj.uzbWord)
        return obj
    });
    const deduplicatedArrayUzb = filterUzbWords.map(obj => {
        return {
            ...obj,
            variants: Array.from(new Set(obj.variants)),
            question: obj.engWord,
            inFact: obj.uzbWord, 

            role: "uzb"

        };
    });

    // inglizcha test
    let addedVariantsEng = shuffledArray.map((obj) => {
        return { ...obj, variants: shuffleArray(engWords, 3) };
    });
    let filterEngWords = addedVariantsEng.map((obj) => {
        obj.variants.push(obj.engWord)
        return obj
    });
    const deduplicatedArrayEng = filterEngWords.map(obj => {
        return {
            ...obj,
            variants: Array.from(new Set(obj.variants)),
            inFact: obj.engWord,
            question: obj.uzbWord, 
            role:"eng"
        };
    });
    // ikkisidaham bor bo'lgan arraylarni render qilib chiqarish kerak.
    const randomWords = shuffleArray(deduplicatedArrayEng.concat(deduplicatedArrayUzb), wordCount)
    const deduplicatedRandomWords = randomWords.map(obj => {
        return {
            ...obj,
            variants: Array.from(new Set(obj.variants)),
            inFact: obj.engWord || obj.uzbWord,
            question: obj.engWord || obj.uzbWord,
            role: "random"
        };
    });
    // return qilayotganda deduplicatedArrayEng, deduplicatedArrayUzb, randomWords ni render qilsa o'ladi.
    // user nechtadir so'zni so'rasa o'shancha so'z random bo'ladi.
    if (sort == "uzb") return deduplicatedArrayUzb
    else if (sort == "eng") return deduplicatedArrayEng
    else if (sort == "random") return deduplicatedRandomWords
}