import jwt from 'jsonwebtoken';
import axios from 'axios';
import bcrypt from 'bcrypt';
import {
    LoginSchema,
    SignupSchema,
    passwordSchema,
} from '../validators/authValidator.js';
import catchAsync from '../utils/catchAsync.js';

class authController {
    //Singup Post API
    static getAll = catchAsync(async (req, res, next) => {
        res.send({
            message: 'Class Data Fetched Successfully',
        });
    });

    static getOne = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        res.send({
            message: 'Class Data Fetched Successfully',
        });
    });

    static create = catchAsync(async (req, res, next) => {
        res.send({
            message: 'Class Created Successfully',
        });
    });

    static update = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        res.send({
            message: 'Class Updated Successfully',
        });
    });

    static delete = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        res.send({
            message: 'Class Deleted Successfully',
        });
    });
}

export default authController;
