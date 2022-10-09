import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    class_id: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    order: {
        type: Number,
        required: false,
    },
});

const subjectModel = mongoose.model('subject', subjectSchema);
export default subjectModel;
