const Todo = require('../models/Todo');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');

// @desc    Get all todos with filters
// @route   GET /api/todos
// @access  Public
exports.getAllTodos = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      priority,
      tags,
      assignedUsers,
      search,
      completed
    } = req.query;

    // Build query
    const query = {};
    
    // Add filters
    if (priority) query.priority = priority;
    if (completed !== undefined) query.completed = completed === 'true';
    if (tags) query.tags = { $in: tags.split(',') };
    if (assignedUsers) query.assignedUsers = { $in: assignedUsers.split(',') };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    // Execute query with pagination
    const todos = await Todo.find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Todo.countDocuments(query);

    res.json({
      todos,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single todo
// @route   GET /api/todos/:id
// @access  Private
exports.getTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)
      .populate('assignedUsers', 'username avatar')
      .populate('createdBy', 'username avatar');

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new todo
// @route   POST /api/todos
// @access  Private
exports.createTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, priority, tags, assignedUsers } = req.body;

    // Create new todo
    const todo = new Todo({
      title,
      description,
      priority,
      tags,
      assignedUsers,
      createdBy: req.user.username
    });

    await todo.save();

    // Populate user references
    await todo.populate('createdBy', 'username avatar');

    res.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
exports.updateTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Check if user owns the todo
    if (todo.createdBy !== req.user.username) {
      return res.status(403).json({ message: 'Not authorized to update this todo' });
    }

    const { title, description, priority, tags, assignedUsers, completed } = req.body;

    // Update fields
    if (title) todo.title = title;
    if (description) todo.description = description;
    if (priority) todo.priority = priority;
    if (tags) todo.tags = tags;
    if (assignedUsers) todo.assignedUsers = assignedUsers;
    if (completed !== undefined) todo.completed = completed;

    await todo.save();

    // Populate user references
    await todo.populate('createdBy', 'username avatar');

    res.json(todo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Check if user owns the todo
    if (todo.createdBy !== req.user.username) {
      return res.status(403).json({ message: 'Not authorized to delete this todo' });
    }

    await Todo.deleteOne({ _id: req.params.id });
    res.json({ message: 'Todo removed' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add note to todo
// @route   POST /api/todos/:id/notes
// @access  Private
exports.addNote = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const { content } = req.body;

    todo.notes.push({
      content,
      createdBy: req.user.username
    });

    await todo.save();

    // Populate user references
    await todo.populate('assignedUsers', 'username avatar');
    await todo.populate('createdBy', 'username avatar');
    await todo.populate('notes.createdBy', 'username avatar');

    res.json(todo);
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Export todos to CSV
// @route   GET /api/todos/export/csv
// @access  Private
exports.exportTodos = async (req, res) => {
  try {
    const {
      priority,
      tags,
      assignedUsers,
      search,
      completed
    } = req.query;

    // Build query
    const query = {};
    
    // Add filters
    if (priority) query.priority = priority;
    if (completed !== undefined) query.completed = completed === 'true';
    if (tags) query.tags = { $in: tags.split(',') };
    if (assignedUsers) query.assignedUsers = { $in: assignedUsers.split(',') };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Get todos with populated fields
    const todos = await Todo.find(query);

    // Prepare CSV data
    const csvData = todos.map(todo => ({
      Title: todo.title,
      Description: todo.description,
      Priority: todo.priority,
      Status: todo.completed ? 'Completed' : 'Pending',
      Tags: todo.tags.join(', '),
      'Assigned Users': todo.assignedUsers.join(', '),
      'Created By': todo.createdBy,
      'Created At': todo.createdAt.toISOString(),
      'Updated At': todo.updatedAt.toISOString()
    }));

    // Create CSV writer
    const csvWriter = createCsvWriter({
      path: path.join(__dirname, '../../exports/todos.csv'),
      header: [
        { id: 'Title', title: 'Title' },
        { id: 'Description', title: 'Description' },
        { id: 'Priority', title: 'Priority' },
        { id: 'Status', title: 'Status' },
        { id: 'Tags', title: 'Tags' },
        { id: 'Assigned Users', title: 'Assigned Users' },
        { id: 'Created By', title: 'Created By' },
        { id: 'Created At', title: 'Created At' },
        { id: 'Updated At', title: 'Updated At' }
      ]
    });

    // Ensure exports directory exists
    const exportsDir = path.join(__dirname, '../../exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    // Write CSV file
    await csvWriter.writeRecords(csvData);

    // Send file
    res.download(path.join(__dirname, '../../exports/todos.csv'), 'todos.csv', (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      // Clean up file after sending
      fs.unlink(path.join(__dirname, '../../exports/todos.csv'), (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        }
      });
    });
  } catch (error) {
    console.error('Export todos error:', error);
    res.status(500).json({ message: 'Error exporting todos' });
  }
}; 