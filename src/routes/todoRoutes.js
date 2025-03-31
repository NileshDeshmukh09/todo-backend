const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const { 
  todoCreateValidators, 
  todoUpdateValidators, 
  todoListValidators, 
  noteCreateValidators 
} = require('../middleware/validators');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Todo management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - title
 *         - createdBy
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the todo
 *         title:
 *           type: string
 *           description: Title of the todo
 *           example: "Team Meeting"
 *         description:
 *           type: string
 *           description: Description of the todo
 *           example: "Weekly team sync meeting"
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           default: medium
 *           description: Priority level of the todo
 *           example: "high"
 *         completed:
 *           type: boolean
 *           default: false
 *           description: Completion status of the todo
 *           example: false
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of tags for the todo
 *           example: ["meeting", "team"]
 *         assignedUsers:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of assigned usernames
 *           example: ["john_doe", "jane_smith"]
 *         createdBy:
 *           type: string
 *           description: Username of the user who created the todo
 *           example: "admin"
 *         notes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Meeting postponed to next week"
 *               createdBy:
 *                 type: string
 *                 example: "john_doe"
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-03-29T10:00:00Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *           example: "2024-03-29T09:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *           example: "2024-03-29T10:00:00Z"
 *         isOverdue:
 *           type: boolean
 *           description: Whether the todo is overdue (high priority and not completed for 24+ hours)
 *           example: true
 */

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos with pagination and filters
 *     tags: [Todos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter by priority
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Filter by completion status
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter by tag
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, priority, title]
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *       - in: query
 *         name: assignedUser
 *         schema:
 *           type: string
 *         description: Filter by assigned user username
 *       - in: query
 *         name: createdBy
 *         schema:
 *           type: string
 *         description: Filter by creator user ID
 *     responses:
 *       200:
 *         description: List of todos with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Todo'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       500:
 *         description: Server error
 */
router.get('/', todoListValidators, todoController.getAllTodos);

// Protected routes (auth required)
router.use(auth);

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get todo by ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/:id', todoController.getTodo);

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Team Meeting"
 *               description:
 *                 type: string
 *                 example: "Weekly team sync meeting"
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: "high"
 *               completed:
 *                 type: boolean
 *                 example: false
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["meeting", "team"]
 *               assignedUsers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["john_doe", "jane_smith"]
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', todoCreateValidators, todoController.createTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Team Meeting"
 *               description:
 *                 type: string
 *                 example: "Weekly team sync meeting"
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: "high"
 *               completed:
 *                 type: boolean
 *                 example: true
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["meeting", "team", "urgent"]
 *               assignedUsers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["john_doe", "jane_smith", "bob_wilson"]
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/:id', todoUpdateValidators, todoController.updateTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       404:
 *         description: Todo not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete('/:id', todoController.deleteTodo);

/**
 * @swagger
 * /api/todos/{id}/notes:
 *   post:
 *     summary: Add a note to a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Content of the note
 *                 example: "Meeting postponed to next week due to team availability"
 *     responses:
 *       201:
 *         description: Note added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/:id/notes', noteCreateValidators, todoController.addNote);

/**
 * @swagger
 * /api/todos/export/csv:
 *   get:
 *     summary: Export todos to CSV
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter by priority
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Filter by completion status
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter by tag
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *       - in: query
 *         name: assignedUser
 *         schema:
 *           type: string
 *         description: Filter by assigned user
 *     responses:
 *       200:
 *         description: CSV file with todos data
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/export/csv', todoController.exportTodos);

module.exports = router; 