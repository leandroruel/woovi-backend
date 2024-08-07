import mongoose from "mongoose";

const { Schema, model } = mongoose;

interface ITransaction extends mongoose.Document {
  senderId: mongoose.Schema.Types.ObjectId;
  receiverId: mongoose.Schema.Types.ObjectId;
  idempotencyId: string;
  amount: number;
  type: "transfer" | "deposit" | "withdraw";
  state: "done" | "pending";
  description: string;
  createdAt: Date;
}

const transactionSchema = new Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  idempotencyId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  type: {
    type: String,
    enum: ["transfer", "deposit", "withdraw"],
    required: true,
  },
  state: {
    type: String,
    enum: ["done", "pending"],
    default: "pending",
  },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Transaction = model<ITransaction>("Transaction", transactionSchema);

export default Transaction;
