import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
});

const classModel = mongoose.model('class', classSchema);
export default classModel;
