import catchAsync from '../utils/catchAsync.js';

class topicController {
    //Singup Post API
    static getAll = catchAsync(async (req, res, next) => {
        const { subject_id } = req.query;
        if (!subject_id)
            return res.status(200).send({
                status: 'fail',
                message: 'subject_id is required',
            });

        const subjectData = await global.DB.Subject.findOne({
            _id: subject_id,
        });

        if (!subjectData)
            return res.status(200).send({
                status: 'fail',
                message: 'No Subject Found with this Subject_Id',
            });

        const topics = await global.DB.Topic.find({ subject_id });

        res.send({
            message: 'Topic Data Fetched Successfully',
            data: topics,
        });
    });

    static getOne = catchAsync(async (req, res, next) => {
        const { id } = req.params;

        const topic = await global.DB.Topic.findOne({ _id: id });

        res.send({
            message: 'Topic Data Fetched Successfully',
            data: topic,
        });
    });

    static create = catchAsync(async (req, res, next) => {
        const { subject_id, title, description, order } = req.body;

        if (!title)
            return res.status(200).send({
                status: 'fail',
                message: 'title is required',
            });
        if (!subject_id)
            return res.status(200).send({
                status: 'fail',
                message: 'subject_id is required',
            });

        const subjectData = await global.DB.Subject.findOne({
            _id: subject_id,
        });

        if (!subjectData)
            return res.status(200).send({
                status: 'fail',
                message: 'No Subject Found with this subject_id',
            });

        const newTopic = new global.DB.Topic({
            title,
            order: order ? +order : 0,
            subject_id,
            description,
        });

        const topicData = await newTopic.save();

        res.send({
            message: 'Topic Created Successfully',
            data: topicData,
        });
    });

    static update = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const { subject_id, title, description, order } = req.body;

        if (!title)
            return res.status(200).send({
                status: 'fail',
                message: 'title is required',
            });

        if (!subject_id)
            return res.status(200).send({
                status: 'fail',
                message: 'subject_id is required',
            });

        const subjectData = await global.DB.Subject.findOne({
            _id: subject_id,
        });

        if (!subjectData)
            return res.status(200).send({
                status: 'fail',
                message: 'No Subject Found with this subject_id',
            });

        const topic = await global.DB.Topic.findByIdAndUpdate(
            { _id: id },
            { subject_id, title, order: order ? +order : 0, description }
        );

        if (!topic)
            return res.status(200).send({
                status: 'fail',
                message: 'No Topic Found with this Id',
            });

        const topicUpdated = await global.DB.Topic.findOne({ _id: id });

        res.send({
            message: 'Topic Updated Successfully',
            data: topicUpdated,
        });
    });

    static delete = catchAsync(async (req, res, next) => {
        const { id } = req.params;

        const topic = await global.DB.Topic.findByIdAndDelete({ _id: id });
        await global.DB.AssignmentAttempt.deleteMany({
            topic_id: id,
        });
        if (!topic)
            return res.status(200).send({
                status: 'fail',
                message: 'No Topic Found with this Id',
            });

        res.send({
            message: 'Topic Deleted Successfully',
            data: topic,
        });
    });
}

export default topicController;
