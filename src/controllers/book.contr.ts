import { Request, Response } from 'express';
import Book from '../schemas/book.schema.js';
import Words from '../schemas/word.schema.js';
import { IBook } from '../interface/interface';
class BookController {
    public async createBook(req: Request, res: Response): Promise<void> {
        const { bookname, description }: IBook = req.body;
        try {
            const book = new Book({ bookname, description });
            await book.save();
            res.status(201).json(book);
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    public async getAllBooks(req: Request, res: Response): Promise<void> {
        try {
            const books: IBook[] | null = await Book.find().populate({
                path: 'units',
                populate: [
                    { path: 'words', model:Words },
                ],
            })
                .exec();

            res.status(200).json(books);
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    public async getBookById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            const book: IBook | null = await Book.findById(id).populate('units');

            if (!book) {
                res.status(404).json({ error: 'Book not found' });
                return;
            }

            res.status(200).json(book);
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    public async updateBook(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { bookname, description }: IBook = req.body;

        try {
            const book = await Book.findByIdAndUpdate(id, { bookname, description }, { new: true });

            if (!book) {
                res.status(404).json({ error: 'Book not found' });
                return;
            }
            res.status(200).json(book);
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    public async deleteBook(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            const book: IBook | null = await Book.findByIdAndDelete(id);

            if (!book) {
                res.status(404).json({ error: 'Book not found' });
                return;
            }

            res.status(204).send(book);
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }
}

export default new BookController();
