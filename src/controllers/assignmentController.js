import catchAsync from '../utils/catchAsync.js';

class assignmentController {
    //Singup Post API
    static getAll = catchAsync(async (req, res, next) => {
        const { topic_id } = req.query;
        if (!topic_id)
            return res.status(200).send({
                status: 'fail',
                message: 'topic_id is required',
            });

        const topicData = await global.DB.Topic.findOne({
            _id: topic_id,
        });

        if (!topicData)
            return res.status(200).send({
                status: 'fail',
                message: 'No Topic Found with this Topic_Id',
            });

        const assignments = await global.DB.Assignment.find({ topic_id });

        res.send({
            message: 'Assignment Data Fetched Successfully',
            data: assignments,
        });
    });

    static getOne = catchAsync(async (req, res, next) => {
        const { id } = req.params;

        const assignment = await global.DB.Assignment.findOne({ _id: id });

        if (!assignment)
            return res.send({
                status: 'fail',
                message: 'No Assignment found with given Id',
                data: null,
            });

        const assignmentQuestions = await global.DB.AssignmentQuestion.find({
            assignment_id: id,
        });

        assignment._doc.questions = assignmentQuestions;

        res.send({
            message: 'Assignment Data Fetched Successfully',
            data: assignment,
        });
    });

    static create = catchAsync(async (req, res, next) => {
        const { topic_id, title, order, questions } = req.body;

        if (!title)
            return res.status(200).send({
                status: 'fail',
                message: 'title is required',
            });
        if (!topic_id)
            return res.status(200).send({
                status: 'fail',
                message: 'topic_id is required',
            });
        if (!questions || questions.length === 0)
            return res.status(200).send({
                status: 'fail',
                message: 'questions is required',
            });

        const topicData = await global.DB.Topic.findOne({
            _id: topic_id,
        });

        if (!topicData)
            return res.status(200).send({
                status: 'fail',
                message: 'No Topic Found with this topic_id',
            });

        const newAssignment = new global.DB.Assignment({
            title,
            order: order ? +order : 0,
            topic_id,
        });
        const assignmentData = await newAssignment.save();
        assignmentData._doc.question = [];

        for (let questionItem of questions) {
            const {
                question,
                option1,
                option2,
                option3,
                option4,
                answer,
                order,
            } = questionItem;

            const assignmentQuestion = new global.DB.AssignmentQuestion({
                assignment_id: assignmentData._id,
                question,
                option1,
                option2,
                option3,
                option4,
                answer,
                order: order ? +order : 0,
            });

            const newAssignmentQuestion = await assignmentQuestion.save();
            assignmentData._doc.question.push(newAssignmentQuestion);
        }

        res.send({
            message: 'Assignment Created Successfully',
            data: assignmentData,
        });
    });

    static update = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const { topic_id, title, order, questions } = req.body;

        if (!title)
            return res.status(200).send({
                status: 'fail',
                message: 'title is required',
            });
        if (!topic_id)
            return res.status(200).send({
                status: 'fail',
                message: 'topic_id is required',
            });
        if (!questions || questions.length === 0)
            return res.status(200).send({
                status: 'fail',
                message: 'questions is required',
            });

        const topicData = await global.DB.Topic.findOne({
            _id: topic_id,
        });

        if (!topicData)
            return res.status(200).send({
                status: 'fail',
                message: 'No Topic Found with this topic_id',
            });

        const assignment = await global.DB.Assignment.findByIdAndUpdate(
            { _id: id },
            { topic_id, title, order: order ? +order : 0 }
        );

        if (!assignment)
            return res.status(200).send({
                status: 'fail',
                message: 'No Assignment Found with this Id',
            });

        await global.DB.AssignmentQuestion.deleteMany({
            assignment_id: assignment._id,
        });

        let task = [];
        for (let questionItem of questions) {
            const {
                _id,
                question,
                option1,
                option2,
                option3,
                option4,
                answer,
                order,
            } = questionItem;

            const assignmentQuestion = new global.DB.AssignmentQuestion({
                assignment_id: assignment._id,
                question,
                option1,
                option2,
                option3,
                option4,
                answer,
                order: order ? +order : 0,
            });
            task.push(assignmentQuestion.save());
            // await
        }

        await Promise.all(task);

        const assignmentUpdated = await global.DB.Assignment.findOne({
            _id: id,
        });

        res.send({
            message: 'Assignment Updated Successfully',
            data: assignmentUpdated,
        });
    });

    static delete = catchAsync(async (req, res, next) => {
        const { id } = req.params;

        const assignment = await global.DB.Assignment.findOne({
            _id: id,
        });

        if (!assignment)
            return res.status(200).send({
                status: 'fail',
                message: 'No Assignment Found with this Id',
            });

        await Promise.all([
            global.DB.AssignmentQuestion.deleteMany({
                assignment_id: assignment._id,
            }),
            global.DB.AssignmentAttempt.deleteMany({
                assignment_id: assignment._id,
            }),
            global.DB.Assignment.findByIdAndDelete({
                _id: id,
            }),
        ]);

        res.send({
            message: 'Assignment Deleted Successfully',
            data: assignment,
        });
    });

    static attempt = catchAsync(async (req, res, next) => {
        const { class_id, subject_id, topic_id, assignment_id, questions } =
            req.body;

        const assignment = await global.DB.Assignment.findOne({
            _id: assignment_id,
        });
        if (!assignment)
            return res.send({
                status: 'fail',
                message: 'No Assignment found with given Id',
                data: null,
            });
        let score = 0;
        let totalScore = 0;

        for (let item of questions) {
            const { _id, userAnswer } = item;
            const assignmentQuestion =
                await global.DB.AssignmentQuestion.findOne({
                    _id: _id,
                    assignment_id,
                });
            if (userAnswer === assignmentQuestion.answer) score++;
            totalScore++;
        }

        const attempt = new global.DB.AssignmentAttempt({
            user_id: req.user._id,
            class_id,
            subject_id,
            topic_id,
            assignment_id,
            total_questions: totalScore,
            correct_answers: score,
        });
        await attempt.save();

        res.send({
            message: 'Assignment Submitted Successfully',
            data: {
                assignment_id,
                totalScore,
                score,
            },
        });
    });

    static getAttemptAssignment = catchAsync(async (req, res, next) => {
        const allAttempts = await global.DB.AssignmentAttempt.find({
            user_id: req.user.id,
        }).sort([['_id', -1]]);
        const dataRes = [];
        for (let item of allAttempts) {
            const [classTitle, subject, topic, assignment] = await Promise.all([
                global.DB.Class.findOne({ _id: item.class_id }, { title: 1 }),
                global.DB.Subject.findOne(
                    { _id: item.subject_id },
                    { title: 1 }
                ),
                global.DB.Topic.findOne({ _id: item.topic_id }, { title: 1 }),
                global.DB.Assignment.findOne(
                    { _id: item.assignment_id },
                    { title: 1 }
                ),
            ]);

            dataRes.push({
                classTitle: classTitle.title,
                subjectTitle: subject.title,
                topicTitle: topic.title,
                assignmentTitle: assignment.title,
                totalScore: item.total_questions,
                yourScore: item.correct_answers,
            });
        }
        res.send({
            message: 'Assignment Attempts Fetched Successfully',
            data: dataRes,
        });
    });

    static getDashboardAssignmentList = catchAsync(async (req, res, next) => {
        const user = await global.DB.User.findOne({ _id: req.user.id });

        const classData = await global.DB.Class.findOne({ _id: user.class_id });

        const subjectData = await global.DB.Subject.find({
            class_id: classData._id,
        });

        const topicData = await global.DB.Topic.find({
            subject_id: { $in: subjectData.map((item) => item._id) },
        });
        const assignmentData = await global.DB.Assignment.find({
            topic_id: { $in: topicData.map((item) => item._id) },
        });

        const data = [];
        for (let assignment of assignmentData) {
            let topic = topicData.find(
                (item) => item._id == assignment.topic_id
            );
            let subject = subjectData.find(
                (item) => item._id == topic.subject_id
            );
            let temp = {
                assignment_id: assignment._id,
                assignment_title: assignment.title,
                topic_id: topic._id,
                topic_title: topic.title,
                subject_id: subject._id,
                subject_title: subject.title,
                class_id: classData._id,
            };
            data.push(temp);
        }

        return res.send({
            message: '',
            data,
        });
    });
}

export default assignmentController;
