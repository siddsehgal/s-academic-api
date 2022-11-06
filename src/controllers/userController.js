import catchAsync from '../utils/catchAsync.js';

class userController {
    static getOne = catchAsync(async (req, res, next) => {
        res.send({
            message: 'User Data Fetched Successfully',
            data: req.user,
        });
    });

    static update = catchAsync(async (req, res, next) => {
        const { _id } = req.user._id;
        const { name, userClass } = req.body;
        let classData;
        if (userClass) {
            classData = await global.DB.Class.findOne({ _id: userClass });
            if (!classData)
                return res.status(200).send({
                    status: 'fail',
                    message: 'No Class found!!',
                });
        }

        await global.DB.User.findByIdAndUpdate(
            { _id },
            {
                ...(name ? { name: name } : {}),
                ...(userClass
                    ? { class_id: classData._id, userClass: classData.title }
                    : {}),
            }
        );

        res.send({
            message: 'User Data Updated Successfully',
        });
    });
}

export default userController;
