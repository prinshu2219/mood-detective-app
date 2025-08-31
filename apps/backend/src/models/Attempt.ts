import mongoose from 'mongoose';

export interface IAttempt {
  _id: string;
  sessionId: mongoose.Types.ObjectId;
  sentence: string;
  engine: 'rules' | 'ml';
  predicted: 'HAPPY' | 'SAD' | 'ANGRY' | 'NEUTRAL';
  correct?: boolean;
  actualLabel?: 'HAPPY' | 'SAD' | 'ANGRY' | 'NEUTRAL';
  score?: number;
  highlights?: Array<{
    token: string;
    weight: number;
  }>;
  responseTime?: number; // in milliseconds
  createdAt: Date;
  updatedAt: Date;
}

const attemptSchema = new mongoose.Schema<IAttempt>(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    sentence: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    engine: {
      type: String,
      required: true,
      enum: ['rules', 'ml'],
    },
    predicted: {
      type: String,
      required: true,
      enum: ['HAPPY', 'SAD', 'ANGRY', 'NEUTRAL'],
    },
    correct: {
      type: Boolean,
    },
    actualLabel: {
      type: String,
      enum: ['HAPPY', 'SAD', 'ANGRY', 'NEUTRAL'],
    },
    score: {
      type: Number,
    },
    highlights: [
      {
        token: {
          type: String,
          required: true,
        },
        weight: {
          type: Number,
          required: true,
        },
      },
    ],
    responseTime: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
attemptSchema.index({ sessionId: 1, createdAt: -1 });
attemptSchema.index({ engine: 1, predicted: 1 });
attemptSchema.index({ correct: 1 });

export const Attempt = mongoose.model<IAttempt>('Attempt', attemptSchema);
