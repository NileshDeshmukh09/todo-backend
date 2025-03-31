const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  completed: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  assignedUsers: [{
    type: String,
    required: true,
    trim: true
  }],
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  notes: [noteSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
todoSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for better query performance
todoSchema.index({ createdBy: 1, createdAt: -1 });
todoSchema.index({ assignedUsers: 1 });
todoSchema.index({ title: 'text', description: 'text' });

// Virtual for overdue status
todoSchema.virtual('isOverdue').get(function() {
  return !this.completed && this.priority === 'high' && 
    (Date.now() - this.createdAt) > 24 * 60 * 60 * 1000; // 24 hours
});

// Method to check if a user has access to this todo
todoSchema.methods.hasAccess = function(userId, username) {
  return this.createdBy === username || 
         this.assignedUsers.includes(username);
};

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo; 