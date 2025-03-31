const sendResponse = (res, data, status = 200) => {
  res.status(status).json({
    success: true,
    data
  });
};

const sendError = (res, message, status = 500) => {
  res.status(status).json({
    success: false,
    error: message
  });
};

module.exports = {
  sendResponse,
  sendError
}; 