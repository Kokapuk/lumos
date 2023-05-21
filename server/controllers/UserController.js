import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';
import { sendServerInternal, sendWithStatus } from '../utils/Errors.js';
import bcrypt from 'bcrypt';

const signToken = (id, login, passwordHash) => {
  const token = jwt.sign(
    {
      _id: id,
      login: login,
      passwordHash: passwordHash,
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  return token;
};

export const signUp = async (req, res) => {
  try {
    const isLoginInUse = await UserModel.exists({ login: req.body.login });

    if (isLoginInUse) {
      return sendWithStatus(res, 409, 'Login already in use');
    }
  } catch (err) {
    console.log(err);
    return sendServerInternal(res);
  }

  const password = req.body.password;
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);

  const doc = new UserModel({
    login: req.body.login,
    passwordHash: hash,
  });

  let user;

  try {
    user = await doc.save();
  } catch (err) {
    console.log(err);
    return sendServerInternal(res);
  }

  const token = signToken(user._id, user.login, user.passwordHash);

  res.json({ login: user.login, token });
};

export const signIn = async (req, res) => {
  let user;

  try {
    user = await UserModel.findOne({ login: req.body.login }).select('+passwordHash');
  } catch (err) {
    console.log(err);
    return sendServerInternal(res);
  }

  if (!user) {
    return sendWithStatus(res, 409, 'Invalid login or password');
  }

  const isPasswordValid = await bcrypt.compare(req.body.password, user.passwordHash);

  if (!isPasswordValid) {
    return sendWithStatus(res, 409, 'Invalid login or password');
  }

  const token = signToken(user._id, user.login, user.passwordHash);
  res.json({ login: user.login, token });
};

export const getMe = async (req, res) => {
  let user;

  try {
    user = await UserModel.findOne({ login: req.user.login });
  } catch (err) {
    console.log(err);
    sendServerInternal(res);
  }

  if (!user) {
    return sendWithStatus(res, 404, 'User with this login does not exist');
  }

  return res.json(user);
};
