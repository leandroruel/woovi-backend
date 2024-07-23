import mongoose from "mongoose";

const { Schema, model } = mongoose;

export interface IAccount extends mongoose.Document {
  idempotencyId: string;
  accountNumber: string;
  userId: mongoose.Schema.Types.ObjectId;
  balance: number;
}

const accountSchema = new Schema(
  {
    idempotencyId: { type: String, required: true, unique: true },
    accountNumber: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true, collation: { locale: "pt", strength: 2 } },
);

const Account = model<IAccount>("Account", accountSchema);

export default Account;
