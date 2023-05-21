const sendWithStatus = (res, statusCode, message) => {
  res.status(statusCode).json({ message });
};

const sendServerInternal = (res) => {
  sendWithStatus(res, 500, 'Server internal error');
};

export { sendWithStatus, sendServerInternal };
