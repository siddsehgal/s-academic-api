import catchAsync from '../utils/catchAsync.js';

class classController {
    static getClassList = catchAsync(async (req, res, next) => {
        const classesData = await global.Class.find({});

        res.send({
            message: 'Class Data Fetched Successfully',
            data: classesData,
        });
    });
    //SingUp Post API
    static getAll = catchAsync(async (req, res, next) => {
        const classes = await global.DB.Class.find();

        res.send({
            message: 'Class Data Fetched Successfully',
            data: classes,
        });
    });

    static getOne = catchAsync(async (req, res, next) => {
        const { id } = req.params;

        const classData = await global.DB.Class.findOne({ _id: id });

        if (!classData)
            return res.status(200).send({
                status: 'fail',
                message: 'No Class Found with this Id',
            });

        res.send({
            message: 'Class Data Fetched Successfully',
            data: classData,
        });
    });

    static create = catchAsync(async (req, res, next) => {
        const { title, order } = req.body;

        if (!title)
            return res.status(200).send({
                status: 'fail',
                message: 'title is required',
            });

        const classExist = await global.DB.Class.findOne({ title });
        if (classExist)
            return res.status(200).send({
                status: 'fail',
                message: 'Class Already Exist with this title',
            });

        const newClass = new global.DB.Class({
            title,
            order: order ? +order : 0,
        });

        const classData = await newClass.save();

        res.send({
            message: 'Class Created Successfully',
            data: classData,
        });
    });

    static update = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const { title, order } = req.body;

        if (!title)
            return res.status(200).send({
                status: 'fail',
                message: 'title is required',
            });

        const classExist = await global.DB.Class.findOne({
            _id: { $ne: id },
            title,
        });
        if (classExist)
            return res.status(200).send({
                status: 'fail',
                message: 'Class Already Exist with this title',
            });

        const classData = await global.DB.Class.findByIdAndUpdate(
            { _id: id },
            { title, order: order ? +order : 0 }
        );

        if (!classData)
            return res.status(200).send({
                status: 'fail',
                message: 'No Class Found with this Id',
            });

        const classDataUpdated = await global.DB.Class.findOne({ _id: id });

        res.send({
            message: 'Class Updated Successfully',
            data: classDataUpdated,
        });
    });

    static delete = catchAsync(async (req, res, next) => {
        const { id } = req.params;

        const classData = await global.DB.Class.findByIdAndDelete({ _id: id });
        await global.DB.AssignmentAttempt.deleteMany({
            class_id: id,
        });

        if (!classData)
            return res.status(200).send({
                status: 'fail',
                message: 'No Class Found with this Id',
            });

        res.send({
            message: 'Class Deleted Successfully',
            data: classData,
        });
    });
}

export default classController;
