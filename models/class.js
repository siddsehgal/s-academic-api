import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
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

const classModel = mongoose.model('class', classSchema);
export default classModel;
