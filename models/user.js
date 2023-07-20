import mongoose from 'mongoose';
import { roles } from '../utils/roles.js';
import mongoosePaginate from "mongoose-paginate-v2";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        uniqe: true,
    },
    email: {
        type: String,
        required: true,
        uniqe: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    license :{
        type: Date,
        required: true,
    },
    isGenerated :{
        type: Boolean,
        required: true,
    },
    role: {
        type: Number,
        enum: [roles.basic, roles.admin], // basic = 0 , admin = 1 
        default: 0,
    },
    trades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trade',
    }],
});

userSchema.plugin(mongoosePaginate); // pagination for later use when the dashboard in the ui is ready.

const User = mongoose.model('User', userSchema);

export default User;
