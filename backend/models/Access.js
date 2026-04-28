import mongoose from 'mongoose';

const accessSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['granted', 'revoked'],
      default: 'granted',
    },
    // Optional: Emergency access expiration
    expiresAt: {
      type: Date,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

// Ensure a patient can only have one active access record per doctor (or we just update the existing one)
accessSchema.index({ patient: 1, doctor: 1 }, { unique: true });

const Access = mongoose.model('Access', accessSchema);

export default Access;
