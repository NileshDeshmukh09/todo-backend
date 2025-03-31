const CONSTANTS = require('../utils/constants');
const { sendError } = require('../utils/response');

const validateTodoInput = (req, res, next) => {
  const { title, priority, status } = req.body;
  
  if (!title) {
    return sendError(res, 'Title is required', 400);
  }
  
  if (priority && !CONSTANTS.PRIORITIES.includes(priority)) {
    return sendError(res, 'Invalid priority value', 400);
  }
  
  if (status && !CONSTANTS.STATUSES.includes(status)) {
    return sendError(res, 'Invalid status value', 400);
  }
  
  next();
};

const validateQueryParams = (req, res, next) => {
  const { page, limit, sort, order } = req.query;
  
  if (page && (isNaN(page) || page < 1)) {
    return sendError(res, 'Invalid page number', 400);
  }
  
  if (limit && (isNaN(limit) || limit < 1 || limit > CONSTANTS.MAX_LIMIT)) {
    return sendError(res, `Invalid limit value. Must be between 1 and ${CONSTANTS.MAX_LIMIT}`, 400);
  }
  
  if (order && !CONSTANTS.SORT_ORDERS.includes(order)) {
    return sendError(res, 'Invalid sort order', 400);
  }
  
  next();
};

module.exports = {
  validateTodoInput,
  validateQueryParams
}; 