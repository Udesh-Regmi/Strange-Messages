import mongoose, { Document } from 'mongoose';

export interface IBirthdayWish extends Document {
    recipientName: string;
    dateOfBirth: Date;
    description: string;
    relationship: string;
    imageUrls: string[];
    createdBy: string;
    createdAt: Date;
    wishId: string;
}

const BirthdayWishSchema = new mongoose.Schema({
    recipientName: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    relationship: {
        type: String,
        required: true,
    },
    imageUrls: [{
        type: String,
    }],
    wishId: {
        type: String,
        required: true,
        unique: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const BirthdayWish = mongoose.models.BirthdayWish || mongoose.model<IBirthdayWish>('BirthdayWish', BirthdayWishSchema);

export default BirthdayWish; 