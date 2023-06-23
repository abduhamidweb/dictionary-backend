import mongoose, { Document, Types } from 'mongoose';

export interface IPost extends Document {
    title: string;
    content: string;
    user: mongoose.Types.ObjectId;
}
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    posts: mongoose.Types.ObjectId[];
}
export interface IProduct extends Document {
    category: 'lavash' | 'shurva' | 'burger' | 'xot-dog' | 'pizza' | 'ichimlik';
    img?: string;
    title: string;
    description: string;
    price: number;
    discount?: number;
    count?: number;
}


export interface IClient extends Document {
    imgLink: string;
    href: string;
}
export interface IBook extends Document {
    bookname: string;
    description: string;
    units: Types.ObjectId[];
}

export interface IUnit extends Document {
    unitname: string;
    description: string;
    words: Types.ObjectId[];
    bookId: mongoose.Types.ObjectId;
}
export interface IWord extends Document {
    engWord: string;
    uzbWord: string;
    transcription: string;
    role: 'user' | 'admin';
    info?: string;
    message?: string;
    unitId: mongoose.Types.ObjectId;
    imgLink?: string;
}