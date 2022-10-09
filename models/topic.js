import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
    subject_id: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    order: {
        type: Number,
        required: false,
    },
});

const topicModel = mongoose.model('topic', topicSchema);
export default topicModel;
