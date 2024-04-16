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
  value: { type: Number, required: true }
})

const Transaction = model('Transaction', transactionSchema)

export default Transaction
