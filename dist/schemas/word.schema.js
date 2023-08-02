import mongoose, { Schema } from 'mongoose';
// Word skhema interfeysi
// Word skhemasi
const wordSchema = new Schema({
    engWord: {
        type: String,
        unique: true,
        required: true,
    },
    uzbWord: {
        type: String,
        required: true
    },
    transcription: {
        type: String,
    },
    role: {
        type: String,
        enum: ['n', 'v', 'adj', 'prep'],
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
const Word = mongoose.model('Word', wordSchema);
export default Word;
