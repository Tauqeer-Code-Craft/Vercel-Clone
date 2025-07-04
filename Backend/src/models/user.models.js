import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    githubId: String,
    username: String,
    accessToken: String,
    email: String,
    avatarUrl: String,
    createdAt: { type: Date, default: Date.now }
}) 

export const User = mongoose.model('User', userSchema)