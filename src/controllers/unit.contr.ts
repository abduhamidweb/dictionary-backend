import { Request, Response } from 'express';
import Unit from '../schemas/unit.schema.js';
import { IUnit } from '../interface/interface';
import Book from '../schemas/book.schema.js';

class UnitController {
    public async createUnit(req: Request, res: Response): Promise<void> {
        const { unitname, description, words, bookId }: IUnit = req.body;
        try {
            const unit = new Unit({ unitname, description, words, bookId });
            await unit.save();
            await Book.findByIdAndUpdate(bookId, {
                $push: {
                    units: unit._id
                }
            });
            res.status(201).json(unit);
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    public async getAllUnits(req: Request, res: Response): Promise<void> {
        try {
            const units: IUnit[] | null = await Unit.find();

            res.status(200).json(units);
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    public async getUnitById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            const unit: IUnit | null = await Unit.findById(id).populate('words');

            if (!unit) {
                res.status(404).json({ error: 'Unit not found' });
                return;
            }

            res.status(200).json(unit);
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    public async updateUnit(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { unitname, description, words, bookId }: IUnit = req.body;

        try {
            const unit = await Unit.findByIdAndUpdate(id, { unitname, description, words, bookId }, { new: true }).populate('words bookId');

            if (!unit) {
                res.status(404).json({ error: 'Unit not found' });
                return;
            }
            res.status(200).json(unit);
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    public async deleteUnit(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            const unit: IUnit | null = await Unit.findByIdAndDelete(id);

            if (!unit) {
                res.status(404).json({ error: 'Unit not found' });
                return;
            }

            res.status(204).send(unit);
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }
}

export default new UnitController();
