import mongoose from 'mongoose';

const dependentSchema = mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    relationship: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'],
    },
  },
  {
    timestamps: true,
  }
);

const Dependent = mongoose.model('Dependent', dependentSchema);

export default Dependent;
