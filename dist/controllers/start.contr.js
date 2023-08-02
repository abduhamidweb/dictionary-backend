var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Book from '../schemas/book.schema.js';
import Unit from '../schemas/unit.schema.js';
import Word from '../schemas/word.schema.js';
import { shuffleArray } from '../utils/shuffle.js';
class StartController {
    start(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const foundBooks = yield findBooksByIds(booksId);
                const matchingUnits = yield findUnitsByBookIdsAndUnitIds(foundBooks, unitsId);
                const matchingWords = yield findWordsByUnitIdsAndWordCount(matchingUnits, wordCount, sort);
                // Teng kelgan so'zlarni JSON formatida javob qiling
                res.send(matchingWords);
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
}
export default new StartController();
// Kitoblarni IDlariga ko'ra qidiruv ---
function findBooksByIds(bookIds) {
    return __awaiter(this, void 0, void 0, function* () {
        const books = yield Book.find();
        return books.filter((book) => bookIds.includes(book._id.toString()));
    });
}
function findUnitsByBookIdsAndUnitIds(books, unitIds) {
    return __awaiter(this, void 0, void 0, function* () {
        const matchingUnits = [];
        for (const book of books) {
            for (const unitId of book.units) {
                if (unitIds.includes(unitId.toString())) {
                    const units = yield Unit.find();
                    const matchingUnit = units.find((unit) => unit._id.toString() === unitId.toString());
                    if (matchingUnit) {
                        matchingUnits.push(matchingUnit);
                    }
                }
            }
        }
        return matchingUnits;
    });
}
function findWordsByUnitIdsAndWordCount(units, wordCount, sort) {
    return __awaiter(this, void 0, void 0, function* () {
        const words = yield Word.find();
        const matchingWords = [];
        for (const unit of units) {
            const unitWords = words.filter((word) => unit.words.includes(word._id));
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
        function mergeWords(data) {
            let engWords = [];
            let uzbWords = [];
            for (let i = 0; i < data.length; i++) {
                engWords.push(data[i].engWord);
                uzbWords.push(data[i].uzbWord);
            }
            return { engWords, uzbWords };
        }
        let shuffledArray = shuffleArray(rearrangedArray, wordCount);
        const { engWords, uzbWords } = mergeWords(rearrangedArray);
        // Uzbekcha test
        let addedVariantsUzb = shuffledArray.map((obj) => {
            return Object.assign(Object.assign({}, obj), { variants: shuffleArray(uzbWords, 3) });
        });
        let filterUzbWords = addedVariantsUzb.map((obj) => {
            // console.log('!obj.variants.includes(obj.uzbWord :', !obj.variants.includes(obj.uzbWord));
            if (!obj.variants.includes(obj.uzbWord)) {
                obj.variants = shuffleArray(obj.variants, 2);
                obj.variants.push(obj.uzbWord);
                obj.variants = shuffleArray(obj.variants, 3);
            }
            return obj;
        });
        const deduplicatedArrayUzb = filterUzbWords.map(obj => {
            return Object.assign(Object.assign({}, obj), { variants: Array.from(new Set(obj.variants)), question: obj.engWord, inFact: obj.uzbWord, role: "uzb" });
        });
        shuffledArray;
        // inglizcha test
        let addedVariantsEng = shuffledArray.map((obj) => {
            return Object.assign(Object.assign({}, obj), { variants: shuffleArray(engWords, 3) });
        });
        let filterEngWords = addedVariantsEng.map((obj) => {
            if (!obj.variants.includes(obj.engWord)) {
                obj.variants = shuffleArray(obj.variants, 2);
                obj.variants.push(obj.engWord);
                obj.variants = shuffleArray(obj.variants, 3);
            }
            return obj;
        });
        const deduplicatedArrayEng = filterEngWords.map(obj => {
            return Object.assign(Object.assign({}, obj), { variants: Array.from(new Set(obj.variants)), inFact: obj.engWord, question: obj.uzbWord, role: "eng" });
        });
        // ikkisidaham bor bo'lgan arraylarni render qilib chiqarish kerak.
        let randomWords = shuffleArray(deduplicatedArrayEng.concat(deduplicatedArrayUzb), wordCount);
        let deduplicatedRandomWords = randomWords.map(obj => {
            let variants = [];
            let variantsUzb = [];
            let variantsEng = [];
            if (obj.role === "eng") {
                variantsUzb = shuffleArray(uzbWords, 2);
                variantsUzb.push(obj.uzbWord);
                variantsUzb = Array.from(new Set(variantsUzb));
                if (variantsUzb.length === 2) {
                    variantsUzb = [...variantsUzb, ...shuffleArray(shuffleArray(uzbWords, 1000), 1)];
                    variantsUzb = shuffleArray(variantsUzb, 3);
                    variantsUzb = shuffleArray(Array.from(new Set(variantsUzb)), 3);
                }
            }
            else {
                variantsEng = shuffleArray(engWords, 2);
                variantsEng.push(obj.engWord);
                variantsEng = Array.from(new Set(variantsEng));
                if (variantsEng.length === 2) {
                    variantsEng = [...variantsEng, ...shuffleArray(shuffleArray(engWords, 1000), 1)];
                    variantsEng = shuffleArray(variantsEng, 3);
                    variantsEng = shuffleArray(Array.from(new Set(variantsEng)), 3);
                }
            }
            variants = [...variantsEng, ...variantsUzb];
            variants = Array.from(new Set(variants)); // Takrorlangan variantlarni olib tashlash
            return Object.assign(Object.assign({}, obj), { variants: shuffleArray(shuffleArray(shuffleArray(variants, 3), 3), 3), question: obj.role === "eng" ? obj.engWord : obj.uzbWord, inFact: obj.role === "eng" ? obj.uzbWord : obj.engWord, role: "random" });
        });
        if (sort == "uzb")
            return deduplicatedArrayUzb;
        else if (sort == "eng")
            return deduplicatedArrayEng;
        else if (sort == "random")
            return deduplicatedRandomWords;
    });
}
