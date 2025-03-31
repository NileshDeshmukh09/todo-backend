const { body, query, validationResult } = require('express-validator');
const User = require('../models/User');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Custom validator for assigned users
const validateAssignedUsers = async (value, { req }) => {
  if (!value) return true;
  
  if (!Array.isArray(value)) {
    throw new Error('Assigned users must be an array');
  }

  // Remove duplicates
  const uniqueUsers = [...new Set(value)];
  
  // Validate each username format
  for (const username of uniqueUsers) {
    if (typeof username !== 'string' || username.length < 3 || username.length > 50) {
      throw new Error(`Invalid username format: ${username}`);
    }
  }

  // Check if all users exist in database
  const existingUsers = await User.find({ username: { $in: uniqueUsers } });
  const existingUsernames = existingUsers.map(user => user.username);
  const invalidUsers = uniqueUsers.filter(username => !existingUsernames.includes(username));
  
  if (invalidUsers.length > 0) {
    throw new Error(`Users not found: ${invalidUsers.join(', ')}`);
  }

  // Store the validated usernames in the request body
  req.body.assignedUsers = uniqueUsers;
  return true;
};

// Todo validators
const todoCreateValidators = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('priority').isIn(['low', 'medium', 'high']).withMessage('Invalid priority level'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('assignedUsers').optional().custom(validateAssignedUsers),
  handleValidationErrors
];

const todoUpdateValidators = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim(),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority level'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('assignedUsers').optional().custom(validateAssignedUsers),
  body('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
  handleValidationErrors
];

const todoListValidators = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sort').optional().isIn(['title', 'priority', 'createdAt', 'updatedAt']).withMessage('Invalid sort field'),
  query('order').optional().isIn(['asc', 'desc']).withMessage('Invalid sort order'),
  query('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority level'),
  query('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
  query('tags').optional().isString().withMessage('Tags must be a comma-separated string'),
  handleValidationErrors
];

// Note validators
const noteCreateValidators = [
  body('content').trim().notEmpty().withMessage('Note content is required'),
  handleValidationErrors
];

module.exports = {
  todoCreateValidators,
  todoUpdateValidators,
  todoListValidators,
  noteCreateValidators
}; 