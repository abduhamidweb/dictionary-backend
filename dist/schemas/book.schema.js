import mongoose, { Schema } from 'mongoose';
// Units skhema va modelini import qilish
// Book skhema interfeysi
// Book skhemasi
const bookSchema = new Schema({
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
const Book = mongoose.model('Book', bookSchema);
export default Book;
