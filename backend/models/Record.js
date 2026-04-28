import mongoose from 'mongoose';

const recordSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    dependent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dependent',
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['prescription', 'lab_report', 'scan', 'other'],
      default: 'other',
    },
    fileUrl: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
      required: true,
    },
    notes: [
      {
        doctor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        content: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        }
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Record = mongoose.model('Record', recordSchema);

export default Record;
