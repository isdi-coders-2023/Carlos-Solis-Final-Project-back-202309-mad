import { Schema, model } from 'mongoose';
import { Monument } from '../../entities/monument.model.js';

const monumentsSchema = new Schema<Monument>({
  name: {
    type: String,
    required: true,
  },
  culture: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },
  monumentImg: {
    publicId: String,
    size: Number,
    width: Number,
    height: Number,
    format: String,
    url: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

monumentsSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject._v;
    delete returnedObject.passwd;
  },
});

export const monumentModel = model<Monument>(
  'Monument',
  monumentsSchema,
  'monuments'
);
