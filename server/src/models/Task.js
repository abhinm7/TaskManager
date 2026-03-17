const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    trim: true 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'], 
    default: 'PENDING' 
  }
}, { timestamps: true });

// Indexing
taskSchema.index({ userId: 1, status: 1, createdAt: -1 }); // for fast filtering and pagination by user
taskSchema.index({ title: 'text' }); // for the required title search feature

module.exports = mongoose.model('Task', taskSchema);