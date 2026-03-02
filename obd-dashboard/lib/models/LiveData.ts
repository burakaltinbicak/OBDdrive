import mongoose, { Schema } from 'mongoose'

const LiveDataSchema = new Schema({
  rpm: { type: Number, required: true },
  temperature: { type: Number, required: true },
  speed: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.LiveData || mongoose.model('LiveData', LiveDataSchema)