import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    email: { type: String, unique: true }
});

const User = models.User || model("User", UserSchema);
export default User;