import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    topic_id: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    link: {
        type: String,
        required: true,
        trim: true,
    },
    order: {
        type: Number,
        required: false,
    },
});

const noteModel = mongoose.model('note', noteSchema);
export default noteModel;
