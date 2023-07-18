import mongoose from "mongoose";
const ResultSchema = new mongoose.Schema({
    resultData: {
        type: Object,
        required: true,
    },
});
export  default mongoose.model('Result', ResultSchema);