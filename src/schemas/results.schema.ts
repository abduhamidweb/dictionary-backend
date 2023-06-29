import mongoose, { Schema, Document, Types } from 'mongoose';
const resultSchema = new Schema({
    users:
        [
            {
                ref: "User",
                type: Types.ObjectId
            }
        ],
    question: {
        type: String,
    },
    answer: {
        type: String
    },
    units: [
        {
            ref: "Unit",
            type: Types.ObjectId
        }
    ],
    errors: {
        type: String
    },
    correct: {
        type: String
    }
});

// Book modelini tuzish
const Book = mongoose.model('Result', resultSchema);

export default Book;