import mongoose, { Schema, Document, Types } from 'mongoose';

// Words skhema va modelini import qilish

// Unit skhema interfeysi
interface IUnit extends Document {
    unitname: string;
    description: string;
    words: Types.ObjectId[];
    bookId: mongoose.Types.ObjectId;
}

// Unit skhemasi
const unitSchema: Schema = new Schema<IUnit>({
    unitname: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    words: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Words'
        }
    ],
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    }
});

// Unit modelini tuzish
const Unit = mongoose.model<IUnit>('Unit', unitSchema);

export default Unit;
