import { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Optional for OAuth users
    name: { type: String },
    email: { type: String, unique: true, required: true },
    googleId: { type: String, unique: true, sparse: true },
});

const User = models.User || model("User", UserSchema);
export default User;