require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Todo = require('../models/Todo');
const logger = require('../utils/logger');

const users = [
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123'
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password123'
  },
  {
    username: 'bob_brown',
    email: 'bob@example.com',
    password: 'password123'
  },
  {
    username: 'alice_johnson',
    email: 'alice@example.com',
    password: 'password123'
  },
  {
    username: 'charlie_davis',
    email: 'charlie@example.com',
    password: 'password123'
  }
];

const todos = [
  {
    title: 'Complete the todo app assignment',
    description: 'Finish implementing all required features',
    priority: 'high',
    completed: false,
    tags: ['work', 'coding', 'assignment'],
    assignedUsers: ['@john_doe', '@jane_smith'],
    notes: [
      {
        content: 'Remember to add proper error handling',
        createdAt: new Date()
      }
    ]
  },
  {
    title: 'Review project documentation',
    description: 'Go through all project documentation and update if needed',
    priority: 'medium',
    completed: true,
    tags: ['documentation', 'review'],
    assignedUsers: ['@bob_brown'],
    notes: [
      {
        content: 'Documentation looks good, but needs some minor updates',
        createdAt: new Date()
      }
    ]
  },
  {
    title: 'Schedule team meeting',
    description: 'Organize a team meeting to discuss project progress',
    priority: 'low',
    completed: false,
    tags: ['meeting', 'team'],
    assignedUsers: ['@alice_johnson'],
    notes: []
  },
  {
    title: 'Update dependencies',
    description: 'Check and update project dependencies',
    priority: 'medium',
    completed: false,
    tags: ['maintenance', 'dependencies'],
    assignedUsers: ['@charlie_davis'],
    notes: [
      {
        content: 'Some packages need major version updates',
        createdAt: new Date()
      }
    ]
  },
  {
    title: 'Write unit tests',
    description: 'Add unit tests for new features',
    priority: 'high',
    completed: false,
    tags: ['testing', 'development'],
    assignedUsers: ['@john_doe'],
    notes: []
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Todo.deleteMany({});
    logger.info('Cleared existing data');

    // Create users (password will be hashed by the User model's pre-save hook)
    const createdUsers = await User.insertMany(users);
    logger.info(`Created ${createdUsers.length} users`);

    // Create todos with user references
    const todosWithUsers = todos.map((todo, index) => ({
      ...todo,
      user: createdUsers[index % createdUsers.length]._id
    }));

    const createdTodos = await Todo.insertMany(todosWithUsers);
    logger.info(`Created ${createdTodos.length} todos`);

    // Verify data
    const userCount = await User.countDocuments();
    const todoCount = await Todo.countDocuments();

    if (userCount !== users.length || todoCount !== todos.length) {
      throw new Error('Data verification failed');
    }

    logger.info('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.info('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    logger.error('Error closing connection:', error);
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Promise Rejection:', error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

seedDatabase(); 