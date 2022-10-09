import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
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
    order: {
        type: Number,
        required: false,
    },
});

const assignmentModel = mongoose.model('assignment', assignmentSchema);
export default assignmentModel;
