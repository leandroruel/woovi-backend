import mongoose from "mongoose";
const { Schema, model } = mongoose;
const TokenSchema = new Schema({
    token: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        default: Date.now,
    },
});
export default model("Token", TokenSchema);
