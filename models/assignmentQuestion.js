import mongoose from 'mongoose';

const assignmentQuestionSchema = new mongoose.Schema({
    assignment_id: {
        type: String,
        required: true,
        trim: true,
    },
    question: {
        type: String,
        required: true,
        trim: true,
    },
    option1: {
        type: String,
    },
    option2: {
        type: String,
    },
    option3: {
        type: String,
    },
    option4: {
        type: String,
    },
    answer: { type: String },
    order: {
        type: Number,
        required: false,
    },
});

const assignmentQuestionModel = mongoose.model(
    'assignmentQuestion',
    assignmentQuestionSchema
);
export default assignmentQuestionModel;
