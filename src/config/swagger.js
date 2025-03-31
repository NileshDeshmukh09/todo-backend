const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo List API',
      version: '1.0.0',
      description: 'API documentation for the Todo List application',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID'
            },
            username: {
              type: 'string',
              description: 'Username'
            },
            email: {
              type: 'string',
              description: 'User email'
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              description: 'User role'
            }
          }
        },
        Todo: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Todo ID'
            },
            title: {
              type: 'string',
              description: 'Todo title'
            },
            description: {
              type: 'string',
              description: 'Todo description'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Todo priority'
            },
            completed: {
              type: 'boolean',
              description: 'Todo completion status'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Todo tags'
            },
            assignedUsers: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Assigned users'
            },
            notes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  content: {
                    type: 'string'
                  },
                  createdAt: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs; 