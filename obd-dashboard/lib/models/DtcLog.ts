import mongoose, { Schema } from 'mongoose'

const DtcLogSchema = new Schema({
  code: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['active', 'cleared'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.DtcLog || mongoose.model('DtcLog', DtcLogSchema)