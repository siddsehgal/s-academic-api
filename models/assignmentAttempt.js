import mongoose from 'mongoose';

const assignmentAttemptSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        trim: true,
    },
    class_id: {
        type: String,
        required: true,
        trim: true,
    },
    subject_id: {
        type: String,
        required: true,
        trim: true,
    },
    topic_id: {
        type: String,
        required: true,
        trim: true,
    },
    assignment_id: {
        type: String,
        required: true,
        trim: true,
    },
    total_questions: {
        type: Number,
        required: true,
        trim: true,
    },
    correct_answers: {
        type: Number,
        required: true,
        trim: true,
    },
    order: {
        type: Number,
        required: false,
    },
});

const assignmentAttemptModel = mongoose.model(
    'assignmentAttempt',
    assignmentAttemptSchema
);
export default assignmentAttemptModel;
