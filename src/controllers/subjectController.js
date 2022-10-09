import catchAsync from '../utils/catchAsync.js';

class subjectController {
    //Singup Post API
    static getAll = catchAsync(async (req, res, next) => {
        const { class_id } = req.query;
        if (!class_id)
            return res.status(200).send({
                status: 'fail',
                message: 'class_id is required',
            });

        const classData = await global.DB.Class.findOne({ _id: class_id });

        if (!classData)
            return res.status(200).send({
                status: 'fail',
                message: 'No Class Found with this Class_Id',
            });

        const subjects = await global.DB.Subject.find({ class_id });

        res.send({
            message: 'Subject Data Fetched Successfully',
            data: subjects,
        });
    });

    static getOne = catchAsync(async (req, res, next) => {
        const { id } = req.params;

        const subject = await global.DB.Subject.findOne({ _id: id });

        res.send({
            message: 'Subject Data Fetched Successfully',
            data: subject,
        });
    });

    static create = catchAsync(async (req, res, next) => {
        const { class_id, title, order } = req.body;

        if (!title)
            return res.status(200).send({
                status: 'fail',
                message: 'title is required',
            });
        if (!class_id)
            return res.status(200).send({
                status: 'fail',
                message: 'class_id is required',
            });

        const classData = await global.DB.Class.findOne({ _id: class_id });

        if (!classData)
            return res.status(200).send({
                status: 'fail',
                message: 'No Class Found with this Class_Id',
            });

        const newSubject = new global.DB.Subject({
            title,
            order: order ? +order : 0,
            class_id,
        });

        const subjectData = await newSubject.save();

        res.send({
            message: 'Subject Created Successfully',
            data: subjectData,
        });
    });

    static update = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const { class_id, title, order } = req.body;

        if (!title)
            return res.status(200).send({
                status: 'fail',
                message: 'title is required',
            });

        if (!class_id)
            return res.status(200).send({
                status: 'fail',
                message: 'class_id is required',
            });

        const classData = await global.DB.Class.findOne({ _id: class_id });

        if (!classData)
            return res.status(200).send({
                status: 'fail',
                message: 'No Class Found with this Class_Id',
            });

        const subject = await global.DB.Subject.findByIdAndUpdate(
            { _id: id },
            { class_id, title, order: order ? +order : 0 }
        );

        if (!subject)
            return res.status(200).send({
                status: 'fail',
                message: 'No Subject Found with this Id',
            });

        const subjectUpdated = await global.DB.Subject.findOne({ _id: id });

        res.send({
            message: 'Subject Updated Successfully',
            data: subjectUpdated,
        });
    });

    static delete = catchAsync(async (req, res, next) => {
        const { id } = req.params;

        const subject = await global.DB.Subject.findByIdAndDelete({ _id: id });
        await global.DB.AssignmentAttempt.deleteMany({
            subject_id: id,
        });
        if (!subject)
            return res.status(200).send({
                status: 'fail',
                message: 'No Subject Found with this Id',
            });

        res.send({
            message: 'Subject Deleted Successfully',
            data: subject,
        });
    });
}

export default subjectController;
