import NoteModel from '../models/Note.js';
import { sendServerInternal, sendWithStatus } from '../utils/Errors.js';

export const create = async (req, res) => {
  const doc = new NoteModel({
    text: req.body.text,
    timeStamp: req.body.timeStamp,
    color: req.body.color,
    owner: req.user._id,
  });

  let note;

  try {
    note = await doc.save();
  } catch (err) {
    console.log(err);
    sendServerInternal(res);
  }

  res.json(note);
};

export const getAll = async (req, res) => {
  try {
    const notes = await NoteModel.find({ owner: req.user }).sort({ timeStamp: -1 });

    res.json(notes);
  } catch (err) {
    console.log(err);
    sendServerInternal(res);
  }
};

export const getOne = async (req, res) => {
  try {
    const note = await NoteModel.findById(req.params.id);

    if (!note) {
      return sendWithStatus(res, 404, 'Failed to find note for given id');
    }

    res.json(note);
  } catch (err) {
    console.log(err);
    sendServerInternal(res);
  }
};

export const update = async (req, res) => {
  try {
    const note = await NoteModel.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text, timeStamp: req.body.timeStamp, color: req.body.color },
      { returnDocument: 'after' }
    );

    if (!note) {
      return sendWithStatus(res, 404, 'Failed to find note for given id');
    }

    res.json(note);
  } catch (err) {
    console.log(err);
    sendServerInternal(res);
  }
};

export const remove = async (req, res) => {
  try {
    const note = await NoteModel.findByIdAndDelete(req.params.id);

    if (!note) {
      return sendWithStatus(res, 404, 'Failed to find note for given id');
    }

    res.json(note);
  } catch (err) {
    console.log(err);
    sendServerInternal(res);
  }
};
