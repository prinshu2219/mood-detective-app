import mongoose from 'mongoose';

export interface IScore {
  _id: string;
  sessionId: mongoose.Types.ObjectId;
  total: number;
  correct: number;
  stars: number; // 1-5 stars based on performance
  difficulty: 'easy' | 'medium' | 'hard';
  timeSpent: number; // in seconds
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const scoreSchema = new mongoose.Schema<IScore>(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    total: {
      type: Number,
      required: true,
      min: 1,
    },
    correct: {
      type: Number,
      required: true,
      min: 0,
    },
    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    timeSpent: {
      type: Number,
      required: true,
      min: 0,
    },
    completedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for leaderboards and analytics
scoreSchema.index({ sessionId: 1 });
scoreSchema.index({ stars: -1, timeSpent: 1 });
scoreSchema.index({ difficulty: 1, stars: -1 });
scoreSchema.index({ completedAt: -1 });

// Virtual for accuracy percentage
scoreSchema.virtual('accuracy').get(function () {
  return this.total > 0 ? Math.round((this.correct / this.total) * 100) : 0;
});

// Ensure virtuals are serialized
scoreSchema.set('toJSON', { virtuals: true });

export const Score = mongoose.model<IScore>('Score', scoreSchema);
