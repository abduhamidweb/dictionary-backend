import { Request, Response } from 'express';
class EndController {
    public async end(req: Request, res: Response) {
        let data = req.body;
        try {
            // Teng kelgan so'zlarni JSON formatida javob qiling
            // res.send(matchingWords);
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
            function processItems(data: DataItem[]): {
                correct: DataItem[];
                incorrect: DataItem[];
                error: DataItem[];
            } {
                const correct: DataItem[] = [];
                const incorrect: DataItem[] = [];
                const error: DataItem[] = [];

                for (const item of data) {
                    if (item.inFact === item.answer) {
                        correct.push(item);
                    } else if (item.answer) {
                        incorrect.push(item);
                    } else {
                        error.push(item);
                    }
                }

                return { correct, incorrect, error };
            }
            const result = processItems(data);
            console.log('result :', result);
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    }
} 
export default new EndController();  