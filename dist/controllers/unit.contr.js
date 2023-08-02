var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Unit from '../schemas/unit.schema.js';
import Book from '../schemas/book.schema.js';
class UnitController {
    createUnit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { description, words, bookId } = req.body;
            try {
                let bookname = yield Book.findById(bookId);
                if (!bookname)
                    throw new Error(`Book ${bookname} not found`);
                let unitname = req.body.unitname += bookname.bookname;
                const unit = new Unit({ unitname, description, words, bookId });
                yield unit.save();
                yield Book.findByIdAndUpdate(bookId, {
                    $push: {
                        units: unit._id
                    }
                });
                res.status(201).json(unit);
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    getAllUnits(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const units = yield Unit.find();
                res.status(200).json(units);
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    getUnitById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const unit = yield Unit.findById(id).populate('words');
                if (!unit) {
                    res.status(404).json({ error: 'Unit not found' });
                    return;
                }
                res.status(200).json(unit);
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    updateUnit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { unitname, description, words, bookId } = req.body;
            try {
                const unit = yield Unit.findByIdAndUpdate(id, { unitname, description, words, bookId }, { new: true }).populate('words bookId');
                if (!unit) {
                    res.status(404).json({ error: 'Unit not found' });
                    return;
                }
                res.status(200).json(unit);
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    deleteUnit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const unit = yield Unit.findByIdAndDelete(id);
                if (!unit) {
                    res.status(404).json({ error: 'Unit not found' });
                    return;
                }
                res.status(204).send(unit);
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
}
export default new UnitController();
