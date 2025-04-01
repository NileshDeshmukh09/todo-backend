# Todo List Application

Swagger Docs : [https](http://localhost:5000/api-docs)
A feature-rich Todo List application built with Node.js, Express, and MongoDB. This application allows users to manage their todos with features like tagging, priority levels, user assignments, and notes.

- SeedData  : `npm run seed`

## Features

### Todo Management
- Create new todos with titles and descriptions
- Add tags and priorities (High, Medium, Low)
- Tag/mention other users in todos (@username)
- Edit existing todos
- Delete todos

### Todo Details
- View detailed information about each todo
- Add notes to todos via a modal
- Track creation and update timestamps

### List View Features
- List all todos with basic information
- Pagination support
- Filter todos by tags, priority, or users
- Sort todos by creation date, priority, etc.

### Data Export
- Export all todos in JSON or CSV format

### User Management
- Pre-created users for testing
- User validation for assignments

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo-app
NODE_ENV=development
```

4. Start MongoDB service on your machine

## Running the Application

### Development Mode
```bash
npm run dev
```
This will start the server with nodemon for automatic reloading.

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` by default.

## API Endpoints

### User Endpoints
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users/init` - Create initial users (development only)

### Todo Endpoints
- `GET /api/todos` - Get all todos (with filtering, sorting, and pagination)
- `GET /api/todos/:id` - Get todo by ID
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `POST /api/todos/:id/notes` - Add note to todo
- `GET /api/todos/export` - Export todos (JSON/CSV)

## Query Parameters

### Todo List Endpoint
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sort` - Field to sort by (default: createdAt)
- `order` - Sort order (asc/desc, default: desc)
- `priority` - Filter by priority
- `tags` - Filter by tags (comma-separated)
- `completed` - Filter by completion status
- `search` - Search in title and description

## Sample API Usage

### Create a Todo
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the todo app implementation",
    "priority": "high",
    "tags": ["work", "coding"],
    "assignedUsers": ["@john_doe"]
  }'
```

### Get Todos with Filters
```bash
curl "http://localhost:5000/api/todos?priority=high&tags=work&page=1&limit=10"
```

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── utils/          # Utility functions
└── server.js       # Application entry point
```

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- cors
- express-validator

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 