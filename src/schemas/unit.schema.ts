import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUnit } from '../interface/interface';

// Words skhema va modelini import qilish

// Unit skhema interfeysi


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
