import catchAsync from '../utils/catchAsync.js';

class noteController {
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
        const notes = await global.DB.Note.find({ topic_id });

        res.send({
            message: 'Note Data Fetched Successfully',
            data: notes,
        });
    });

    static getOne = catchAsync(async (req, res, next) => {
        const { id } = req.params;

        const note = await global.DB.Note.findOne({ _id: id });

        res.send({
            message: 'Note Data Fetched Successfully',
            data: note,
        });
    });

    static create = catchAsync(async (req, res, next) => {
        const { topic_id, title, link, order } = req.body;

        if (!title)
            return res.status(200).send({
                status: 'fail',
                message: 'title is required',
            });
        if (!link)
            return res.status(200).send({
                status: 'fail',
                message: 'link is required',
            });
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
                message: 'No Topic Found with this topic_id',
            });

        const newNote = new global.DB.Note({
            title,
            order: order ? +order : 0,
            topic_id,
            link,
        });

        const noteData = await newNote.save();

        res.send({
            message: 'Note Created Successfully',
            data: noteData,
        });
    });

    static update = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const { topic_id, title, link, order } = req.body;

        if (!title)
            return res.status(200).send({
                status: 'fail',
                message: 'title is required',
            });
        if (!link)
            return res.status(200).send({
                status: 'fail',
                message: 'link is required',
            });
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
                message: 'No Topic Found with this topic_id',
            });

        const note = await global.DB.Note.findByIdAndUpdate(
            { _id: id },
            { topic_id, title, order: order ? +order : 0, link }
        );

        if (!note)
            return res.status(200).send({
                status: 'fail',
                message: 'No Note Found with this Id',
            });

        const noteUpdated = await global.DB.Note.findOne({ _id: id });

        res.send({
            message: 'Note Updated Successfully',
            data: noteUpdated,
        });
    });

    static delete = catchAsync(async (req, res, next) => {
        const { id } = req.params;

        const note = await global.DB.Note.findByIdAndDelete({ _id: id });

        if (!note)
            return res.status(200).send({
                status: 'fail',
                message: 'No Note Found with this Id',
            });

        res.send({
            message: 'Note Deleted Successfully',
            data: note,
        });
    });
}

export default noteController;
