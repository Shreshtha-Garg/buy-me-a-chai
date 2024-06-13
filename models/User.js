import mongoose from "mongoose";
const { Schema,model } = mongoose;
const userSchema = new Schema({
    name: {
        type: String,
        // required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        // unique username for each user
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: "",
    },
    coverPic: {
        type: String,
        default: "",
    },
    razorpay_id: {
        type: String,
        default: "",
    },
    razorpay_secret: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "creator",
    },
    linkedin: {
        type: String,
        default: "",
    },
    instagram: {
        type: String,
        default: "",
    },
    github: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});
    export default mongoose.models.User || model("User", userSchema);