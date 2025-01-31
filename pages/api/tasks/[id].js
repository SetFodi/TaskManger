import connectToDatabase from '../../../lib/mongodb';
import Task from '../../../models/Task';

export default async function handler(req, res) {
    await connectToDatabase();
    const { id } = req.query;
  
    if (req.method === 'PUT') {
      const { completed, priority } = req.body;
      const task = await Task.findByIdAndUpdate(id, { completed, priority }, { new: true });
      return res.status(200).json(task);
    }
  
    if (req.method === 'DELETE') {
      await Task.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Task deleted' });
    }
  
    res.status(405).json({ message: 'Method Not Allowed' });
  }
  
