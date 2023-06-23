import mongoose, { Schema, Document } from 'mongoose';
import { IWord } from '../interface/interface';

// Word skhema interfeysi


// Word skhemasi
const wordSchema: Schema = new Schema<IWord>({
    engWord: {
        type: String,
        required: true
    },
    uzbWord: {
        type: String,
        required: true
    },
    transcription: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        required: true
    },
    info: {
        type: String
    },
    message: {
        type: String
    },
    unitId: {
        type: Schema.Types.ObjectId,
        ref: 'Unit',
        required: true
    },
    imgLink: {
        type: String
    }
});

// Word modelini tuzish
const Word = mongoose.model<IWord>('Word', wordSchema);

export default Word;
