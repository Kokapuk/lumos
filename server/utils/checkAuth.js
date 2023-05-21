import { sendWithStatus } from './Errors.js';
import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');

  if (!token) {
    return sendWithStatus(res, 498, 'Invalid token');
  }

  let decrypted;

  try {
    decrypted = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.log(err);

    if (err instanceof jwt.TokenExpiredError) {
      return sendWithStatus(res, 440, 'Token expired');
    }

    sendWithStatus(res, 498, 'Ivalid token');
  }

  const { passwordHash, ...user } = decrypted;

  req.user = user;
  next();
};
