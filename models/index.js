import mongoose from 'mongoose';
import User from './user.js';
function ConnectDB() {
    const db = mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const Data = {
        User,
    };

    global.DB = Data;
}

export default ConnectDB;
