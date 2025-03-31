const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const { securityHeaders, limiter, sanitizeInput } = require('./middleware/security');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/database');
const logger = require('./utils/logger');
const CONSTANTS = require('./utils/constants');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
const corsOptions = {
  origin: "http://localhost:3000", // Change to your frontend URL
  credentials: true, 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));


// Security middleware
app.use(securityHeaders);
app.use(limiter);
app.use(sanitizeInput);

// Swagger configuration
const swaggerOptions = {
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
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    path.join(__dirname, 'routes/*.js'),
    path.join(__dirname, 'docs/*.js')
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
const generalRoutes = require('./routes/generalRoutes');
const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');

// API routes
app.use('/api', generalRoutes);
app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.redirect('/api/welcome');
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
}); 