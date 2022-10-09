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

        if (!name || !userClass)
            return res.status(200).send({
                status: 'fail',
                message: 'Name and Class are required!!',
            });

        await global.DB.User.findByIdAndUpdate({ _id }, { name, userClass });

        res.send({
            message: 'User Data Updated Successfully',
        });
    });
}

export default userController;
