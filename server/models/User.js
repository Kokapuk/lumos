import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
    select: false,
  },
});

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
