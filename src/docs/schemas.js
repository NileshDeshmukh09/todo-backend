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
 *         description:
 *           type: string
 *           description: Description of the todo
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: Priority level of the todo
 *         completed:
 *           type: boolean
 *           description: Whether the todo is completed
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of tags for the todo
 *         assignedUsers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               username:
 *                 type: string
 *               avatar:
 *                 type: string
 *           description: Array of assigned users
 *         createdBy:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             username:
 *               type: string
 *             avatar:
 *               type: string
 *           description: User who created the todo
 *         notes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               createdBy:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   avatar:
 *                     type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *           description: Array of notes on the todo
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         title: "Complete project documentation"
 *         description: "Write comprehensive documentation for the project"
 *         priority: "high"
 *         completed: false
 *         tags: ["documentation", "project"]
 *         assignedUsers: [
 *           {
 *             _id: "507f1f77bcf86cd799439012",
 *             username: "john_doe",
 *             avatar: "https://example.com/avatar.jpg"
 *           }
 *         ]
 *         createdBy: {
 *           _id: "507f1f77bcf86cd799439013",
 *           username: "jane_smith",
 *           avatar: "https://example.com/avatar.jpg"
 *         }
 *         notes: [
 *           {
 *             content: "Started working on the documentation",
 *             createdBy: {
 *               _id: "507f1f77bcf86cd799439013",
 *               username: "jane_smith",
 *               avatar: "https://example.com/avatar.jpg"
 *             },
 *             createdAt: "2024-03-20T10:00:00Z"
 *           }
 *         ]
 *         createdAt: "2024-03-20T10:00:00Z"
 *         updatedAt: "2024-03-20T10:00:00Z"
 */ 