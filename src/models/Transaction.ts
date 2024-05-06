import mongoose from 'mongoose'

const { Schema, model } = mongoose

const transactionSchema = new Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  idempotencyId: { type: String, required: true, unique: true },
  value: { type: Number, required: true },
  type: {
    type: String,
    enum: ['transfer', 'deposit', 'withdraw'],
    required: true
  },
  state: {
    type: String,
    enum: ['done', 'pending'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
})

const Transaction = model('Transaction', transactionSchema)

export default Transaction
