const CONSTANTS = {
  PRIORITIES: ['low', 'medium', 'high'],
  STATUSES: ['pending', 'in_progress', 'completed'],
  SORT_ORDERS: ['asc', 'desc'],
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  DEFAULT_SORT: 'createdAt',
  DEFAULT_ORDER: 'desc',
  MAX_LIMIT: 100,
  JWT_EXPIRY: '24h',
  CORS_ORIGIN: 'http://localhost:3000'
};

module.exports = CONSTANTS; 