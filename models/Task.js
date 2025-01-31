import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ["low", "medium", "high"], default: "low" }, // ✅ Priority Field Added
});

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
