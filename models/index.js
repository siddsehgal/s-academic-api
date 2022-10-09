import mongoose from 'mongoose';
import User from './user.js';
import Class from './class.js';
import Subject from './subject.js';
import Topic from './topic.js';
import Note from './note.js';
import Video from './video.js';
import Assignment from './assignment.js';
import AssignmentQuestion from './assignmentQuestion.js';
import AssignmentAttempt from './assignmentAttempt.js';

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
            Subject,
            Topic,
            Note,
            Video,
            Assignment,
            AssignmentQuestion,
            AssignmentAttempt,
        };

        global.DB = Data;
    } catch (error) {
        console.log('Error connecting to MongoDB');
        console.log('Error:', error);
    }
}

export default ConnectDB;
