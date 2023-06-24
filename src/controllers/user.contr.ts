import { Request, Response } from 'express';
import User from '../schemas/user.schema.js';
import { JWT } from '../utils/jwt.js';

class UserController {
    public async createUser(req: Request, res: Response): Promise<void> {
        const { username } = req.body;
        try {
            if (!username) throw new Error(`Username must be`);
            const user = new User({ username });
            await user.save();
            res.status(201).json({ success: true, data: user.username, token: JWT.SIGN({ id: user._id }) });
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    public async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    public async getUserById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const user = await User.findById(id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.status(200).json(user);
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    public async updateUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { username } = req.body;
        try {
            const user = await User.findByIdAndUpdate(id, { username }, { new: true });
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.status(200).json(user);
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    public async deleteUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const user = await User.findByIdAndDelete(id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.status(204).send(user);
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }
}

export default new UserController();
