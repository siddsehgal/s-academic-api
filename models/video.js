import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
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

const videoModel = mongoose.model('video', videoSchema);
export default videoModel;
