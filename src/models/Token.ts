import mongoose from "mongoose";

const { Schema, model } = mongoose;

export interface IToken extends Document {
  token: string;
  expiresAt: Date;
}

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

export default model<IToken>("Token", TokenSchema);
