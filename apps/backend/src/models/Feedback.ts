import mongoose from 'mongoose';

export interface IFeedback {
  _id: string;
  sessionId: mongoose.Types.ObjectId;
  emojiRating: number; // 1-5 emoji rating
  comment?: string;
  category: 'game' | 'ui' | 'content' | 'general';
  helpful: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new mongoose.Schema<IFeedback>(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    emojiRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      enum: ['game', 'ui', 'content', 'general'],
      default: 'general',
    },
    helpful: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for feedback analysis
feedbackSchema.index({ sessionId: 1 });
feedbackSchema.index({ emojiRating: 1 });
feedbackSchema.index({ category: 1 });
feedbackSchema.index({ createdAt: -1 });

export const Feedback = mongoose.model<IFeedback>('Feedback', feedbackSchema);
