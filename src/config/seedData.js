// Default password for seeded users
const DEFAULT_PASSWORD = process.env.SEED_DEFAULT_PASSWORD || 'ChangeMe123!';

const seedData = {
  users: [
    {
      username: 'admin',
      email: 'admin@example.com',
      password: DEFAULT_PASSWORD,
      role: 'admin'
    },
    {
      username: 'user1',
      email: 'user1@example.com',
      password: DEFAULT_PASSWORD,
      role: 'user'
    },
    {
      username: 'user2',
      email: 'user2@example.com',
      password: DEFAULT_PASSWORD,
      role: 'user'
    }
  ],
  todos: [
    {
      title: 'Complete project documentation',
      description: 'Write comprehensive documentation for the todo list project',
      priority: 'high',
      completed: false,
      tags: ['documentation', 'project'],
      notes: [
        {
          content: 'Include API documentation',
          createdAt: new Date()
        }
      ]
    },
    {
      title: 'Implement user authentication',
      description: 'Add JWT-based authentication to the application',
      priority: 'high',
      completed: false,
      tags: ['auth', 'security'],
      notes: [
        {
          content: 'Use JWT for token generation',
          createdAt: new Date()
        }
      ]
    },
    {
      title: 'Design database schema',
      description: 'Create MongoDB schema for users and todos',
      priority: 'medium',
      completed: true,
      tags: ['database', 'design'],
      notes: [
        {
          content: 'Include timestamps and indexes',
          createdAt: new Date()
        }
      ]
    }
  ]
};

module.exports = seedData; 