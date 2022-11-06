import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
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
    class_id: {
        type: String,
    },
    userClass: {
        type: String,
        // required: true,
    },
    password: {
        type: String,
        trim: true,
    },
    isGoogleLogin: {
        type: Boolean,
        default: false,
    },
    googleId: {
        type: String,
        trim: true,
    },
    googleImgUrl: {
        type: String,
        trim: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    joinDate: { type: String, trim: true },
});

const userModel = mongoose.model('user', userSchema);
export default userModel;
