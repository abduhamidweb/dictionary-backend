import mongoose, { Schema, Document, Types } from 'mongoose';
import { IBook } from '../interface/interface';

// Units skhema va modelini import qilish

// Book skhema interfeysi

// Book skhemasi
const bookSchema: Schema = new Schema<IBook>({
    bookname: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    units: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Unit'
        }
    ]
});

// Book modelini tuzish
const Book = mongoose.model<IBook>('Book', bookSchema);

export default Book;
