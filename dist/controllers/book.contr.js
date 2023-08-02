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
import Words from '../schemas/word.schema.js';
class BookController {
    createBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bookname, description } = req.body;
            try {
                const book = new Book({ bookname, description });
                yield book.save();
                res.status(201).json(book);
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    getAllBooks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const books = yield Book.find().populate({
                    path: 'units',
                    populate: [
                        { path: 'words', model: Words },
                    ],
                })
                    .exec();
                res.status(200).json(books);
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    getBookById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const book = yield Book.findById(id).populate('units');
                if (!book) {
                    res.status(404).json({ error: 'Book not found' });
                    return;
                }
                res.status(200).json(book);
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    updateBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { bookname, description } = req.body;
            try {
                const book = yield Book.findByIdAndUpdate(id, { bookname, description }, { new: true });
                if (!book) {
                    res.status(404).json({ error: 'Book not found' });
                    return;
                }
                res.status(200).json(book);
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    deleteBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const book = yield Book.findByIdAndDelete(id);
                if (!book) {
                    res.status(404).json({ error: 'Book not found' });
                    return;
                }
                res.status(204).send(book);
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
}
export default new BookController();
