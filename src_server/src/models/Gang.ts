import mongoose from 'mongoose';

const { Schema } = mongoose;

type Member = {
    _id: string;
    userId: string;
    rank?: string;
};
type Rank = {
    _id: string;
    name: string;
    permissions: {
        [key: string]: boolean;
    };
};

export type Fam = {
    name: string;
    owner: string;
    money: number;
    members: Member[];
    ranks: Rank[];
};

const memberSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    rank: Schema.Types.ObjectId
});
const rankSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    permissions: {
        type: Object,
        default: {}
    }
});

const familySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    money: {
        type: Number,
        default: 0
    },
    ranks: [rankSchema],
    members: [memberSchema]
});

export default mongoose.model<Fam & mongoose.Document>('Fam', familySchema);
