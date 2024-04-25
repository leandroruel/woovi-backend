import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
const { Schema, model } = mongoose

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    tax_id: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    password_reset_token: {
      type: String
    },
    gender: {
      type: String,
      enum: ['Male', 'Female']
    },
    birthdate: {
      type: Date,
      required: true
    },
    role: { type: String, enum: ['Admin', 'User'], default: 'User'}
  },
  { timestamps: true, collation: { locale: 'pt', strength: 2 } }
)

userSchema.plugin(mongoosePaginate)
userSchema.index({ email: -1 }, { unique: true })

const User = model('Users', userSchema)

export default User
