import { Schema, model } from 'mongoose';

const noteSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Note = model('Note', noteSchema);
export default Note;


