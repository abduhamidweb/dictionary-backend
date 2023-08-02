import mongoose, { Schema } from 'mongoose';
// Words skhema va modelini import qilish
// Unit skhema interfeysi
// Unit skhemasi
const unitSchema = new Schema({
    unitname: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true
    },
    words: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Word'
        }
    ],
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    }
});
// Unit modelini tuzish
const Unit = mongoose.model('Unit', unitSchema);
export default Unit;
