import connectToDatabase from '../../../lib/mongodb';
import Task from '../../../models/Task';

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const tasks = await Task.find({});
    return res.status(200).json(tasks);
  }

  if (req.method === 'POST') {
    const { title, priority } = req.body; // ✅ Get priority from request

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({ title, priority });
    return res.status(201).json(task);
  }
  
  res.status(405).json({ message: 'Method Not Allowed' });
}
