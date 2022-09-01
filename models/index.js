import mongoose from 'mongoose';
import User from './user.js';
import Class from './class.js';

function ConnectDB() {
    try {
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'SAcademicDB',
        });

        mongoose.connection.on('connected', function () {
            console.log('Connected to MongoDB Successfully');
        });

        const Data = {
            User,
            Class,
        };

        global.DB = Data;
    } catch (error) {
        console.log('Error connecting to MongoDB');
        console.log('Error:', error);
    }
}

export default ConnectDB;
