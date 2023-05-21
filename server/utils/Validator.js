import { body, validationResult } from 'express-validator';

export const minLoginLength = 3;
export const maxLoginLength = 12;
export const minPasswordLength = 4;
export const maxPasswordLength = 32;

export const signInValidation = [
  body('login', `Login must be between ${minLoginLength} and ${maxLoginLength} characters`).isLength({
    min: minLoginLength,
    max: maxLoginLength,
  }),
  body('password', `Password must be between ${minPasswordLength} and ${maxPasswordLength} characters`).isLength({
    min: minPasswordLength,
    max: maxPasswordLength,
  }),
];

export const signUpValidation = [...signInValidation];

export const minNoteTextLength = 3;
export const maxNoteTextLength = 256;

export const noteCreateValidation = [
  body('text', `Text must be between ${minNoteTextLength} and ${maxNoteTextLength}`).isLength({
    min: minNoteTextLength,
    max: maxNoteTextLength,
  }),
  body('timeStamp', 'Time stamp must be a number of milliseconds since epoch').isInt(),
  body('color', 'Color must be a hex string').isHexColor(),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  res.status(400).json({ message: 'Bad request', errors: errors.array() });
};
