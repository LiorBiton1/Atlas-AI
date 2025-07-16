import { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Make optional for Google users
    name: { type: String },
    email: { type: String, unique: true }
});

const User = models.User || model("User", UserSchema);
export default User;