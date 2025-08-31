import mongoose from 'mongoose';

export interface ISession {
  _id: string;
  startedAt: Date;
  kidName?: string;
  grade?: number;
  locale?: string;
  completedAt?: Date;
  totalScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new mongoose.Schema<ISession>(
  {
    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    kidName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    grade: {
      type: Number,
      min: 1,
      max: 12,
    },
    locale: {
      type: String,
      default: 'en',
      enum: ['en', 'hi'], // English, Hindi (future)
    },
    completedAt: {
      type: Date,
    },
    totalScore: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for querying sessions
sessionSchema.index({ startedAt: -1 });
sessionSchema.index({ kidName: 1 });

export const Session = mongoose.model<ISession>('Session', sessionSchema);
