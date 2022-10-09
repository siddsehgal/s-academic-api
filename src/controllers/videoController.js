import catchAsync from '../utils/catchAsync.js';

class videoController {
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

        const videos = await global.DB.Video.find({ topic_id });

        res.send({
            message: 'Video Data Fetched Successfully',
            data: videos,
        });
    });

    static getOne = catchAsync(async (req, res, next) => {
        const { id } = req.params;

        const video = await global.DB.Video.findOne({ _id: id });

        res.send({
            message: 'Video Data Fetched Successfully',
            data: video,
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

        const newVideo = new global.DB.Video({
            title,
            order: order ? +order : 0,
            topic_id,
            link,
        });

        const videoData = await newVideo.save();

        res.send({
            message: 'Video Created Successfully',
            data: videoData,
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

        const video = await global.DB.Video.findByIdAndUpdate(
            { _id: id },
            { topic_id, title, order: order ? +order : 0, link }
        );

        if (!video)
            return res.status(200).send({
                status: 'fail',
                message: 'No Video Found with this Id',
            });

        const videoUpdated = await global.DB.Video.findOne({ _id: id });

        res.send({
            message: 'Video Updated Successfully',
            data: videoUpdated,
        });
    });

    static delete = catchAsync(async (req, res, next) => {
        const { id } = req.params;

        const video = await global.DB.Video.findByIdAndDelete({ _id: id });

        if (!video)
            return res.status(200).send({
                status: 'fail',
                message: 'No Video Found with this Id',
            });

        res.send({
            message: 'Video Deleted Successfully',
            data: video,
        });
    });
}

export default videoController;
