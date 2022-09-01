import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        trim: true,
    },
});

const userModel = mongoose.model('user', userSchema);
export default userModel;
