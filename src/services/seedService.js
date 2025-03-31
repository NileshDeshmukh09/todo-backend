const User = require('../models/User');
const Todo = require('../models/Todo');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const seedData = require('../config/seedData');

// Valid priority values
const VALID_PRIORITIES = ['low', 'medium', 'high'];

/**
 * Validates the seed data structure
 * @throws {Error} If seed data is invalid
 */
const validateSeedData = () => {
  if (!Array.isArray(seedData.users) || !Array.isArray(seedData.todos)) {
    throw new Error('Invalid seed data structure: users and todos must be arrays');
  }

  // Validate users
  seedData.users.forEach((user, index) => {
    if (!user.username || !user.email || !user.password || !user.role) {
      throw new Error(`Invalid user data at index ${index}: missing required fields`);
    }
    if (!['admin', 'user'].includes(user.role)) {
      throw new Error(`Invalid user role at index ${index}: must be 'admin' or 'user'`);
    }
    if (!user.email.includes('@')) {
      throw new Error(`Invalid email at index ${index}: must be a valid email address`);
    }
  });

  // Validate todos
  seedData.todos.forEach((todo, index) => {
    if (!todo.title || !todo.description || !todo.priority) {
      throw new Error(`Invalid todo data at index ${index}: missing required fields`);
    }
    if (!VALID_PRIORITIES.includes(todo.priority)) {
      throw new Error(`Invalid priority at index ${index}: must be one of ${VALID_PRIORITIES.join(', ')}`);
    }
    if (todo.notes && !Array.isArray(todo.notes)) {
      throw new Error(`Invalid notes at index ${index}: must be an array`);
    }
    if (todo.tags && !Array.isArray(todo.tags)) {
      throw new Error(`Invalid tags at index ${index}: must be an array`);
    }
  });
};

/**
 * Checks if MongoDB is connected
 * @returns {Promise<boolean>}
 */
const isMongoConnected = async () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Seeds the database with initial data
 * @param {boolean} force - Whether to force seeding even if data exists
 * @returns {Promise<void>}
 * @throws {Error} If seeding fails
 */
const seedDatabase = async (force = false) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app');
    logger.info('Connected to MongoDB');

    if (force) {
      // Clear existing data
      await User.deleteMany({});
      await Todo.deleteMany({});
      logger.info('Cleared existing data');
    }

    // Insert users
    const insertedUsers = await User.insertMany(seedData.users);
    logger.info(`Seeded ${insertedUsers.length} users`);

    // Insert todos
    const insertedTodos = await Todo.insertMany(seedData.todos);
    logger.info(`Seeded ${insertedTodos.length} todos`);

    // Close the connection
    await mongoose.connection.close();
    logger.info('Database connection closed');

    return {
      users: insertedUsers,
      todos: insertedTodos
    };
  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  }
};

module.exports = seedDatabase; 