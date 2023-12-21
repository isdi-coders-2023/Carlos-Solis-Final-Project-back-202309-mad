import { Schema, model } from 'mongoose';
import { User } from '../../entities/user.js';
import debug from 'debug';

const debugInstance = debug('ProjectFinal:users:model');
debugInstance('Instantiated');

const usersSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwd: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  surname: {
    type: String,
  },
  monuments: [{ type: Schema.Types.ObjectId, ref: 'monuments' }],
});

usersSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwd;
  },
});

export const UserModel = model<User>('User', usersSchema, 'users');
