import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const NoteModel = mongoose.model('Note', NoteSchema);
export default NoteModel;
