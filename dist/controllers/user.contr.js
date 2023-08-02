var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from '../schemas/user.schema.js';
import { JWT } from '../utils/jwt.js';
class UserController {
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username } = req.body;
            try {
                if (!username)
                    throw new Error(`Username must be`);
                const user = new User({ username });
                yield user.save();
                res.status(201).json({ success: true, data: user.username, token: JWT.SIGN({ id: user._id }) });
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User.find();
                res.status(200).json(users);
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const user = yield User.findById(id);
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.status(200).json(user);
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { username } = req.body;
            try {
                const user = yield User.findByIdAndUpdate(id, { username }, { new: true });
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.status(200).json(user);
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const user = yield User.findByIdAndDelete(id);
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.status(204).send(user);
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
}
export default new UserController();
