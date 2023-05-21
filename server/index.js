import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import * as NoteController from './controllers/NoteController.js';
import * as UserController from './controllers/UserController.js';
import { handleValidationErrors, noteCreateValidation, signInValidation, signUpValidation } from './utils/Validator.js';
import checkAuth from './utils/checkAuth.js';

dotenv.config();

try {
  await mongoose.connect(process.env.DB_URI);
  console.log('Connected to DB');
} catch (err) {
  console.log(err);
  process.exit();
}

const app = express();

app.use(express.json());
app.use(cors());

app.post('/auth/signup', signUpValidation, handleValidationErrors, UserController.signUp);
app.post('/auth/signin', signInValidation, handleValidationErrors, UserController.signIn);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/notes', noteCreateValidation, handleValidationErrors, checkAuth, NoteController.create);
app.get('/notes', checkAuth, NoteController.getAll);
app.get('/notes/:id', checkAuth, NoteController.getOne);
app.patch('/notes/:id', checkAuth, NoteController.update);
app.delete('/notes/:id', checkAuth, NoteController.remove);

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log('Server started...');
});
