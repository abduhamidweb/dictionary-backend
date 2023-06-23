import mongoose, { Schema, Document, Types } from 'mongoose';

// Units skhema va modelini import qilish

// Book skhema interfeysi
interface IBook extends Document {
    bookname: string;
    description: string;
    units: Types.ObjectId[];
}

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
            ref: 'Units'
        }
    ]
});

// Book modelini tuzish
const Book = mongoose.model<IBook>('Book', bookSchema);

export default Book;
