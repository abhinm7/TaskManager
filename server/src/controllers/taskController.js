const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const task = await Task.create({
      userId: req.userId,
      title,
      description,
      status
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(`Create Task Error: ${error.message}`);
    res.status(400).json({ error: 'Failed to create task. Check required fields.' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    const query = { userId: req.userId };

    // Apply Status Filter
    if (status) query.status = status;

    // Apply Text Search 
    if (search) query.$text = { $search: search };

    // Execute query with pagination and sorting
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.status(200).json({
      tasks,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(`Get Tasks Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find and update in one atomic operation, strictly enforcing userId
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ error: 'Task not found or unauthorized' });

    res.status(200).json(task);
  } catch (error) {
    console.error(`Update Task Error: ${error.message}`);
    res.status(400).json({ error: 'Failed to update task' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, userId: req.userId });

    if (!task) return res.status(404).json({ error: 'Task not found or unauthorized' });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(`Delete Task Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};