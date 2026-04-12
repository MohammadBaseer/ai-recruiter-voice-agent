import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IInterview extends Document {
  candidate: Types.ObjectId;
  job: Types.ObjectId;
  scheduledAt: Date;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  transcript?: string;
  score?: number;
  feedback?: string;
  recordingUrl?: string;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema: Schema = new Schema(
  {
    candidate: {
      type: Schema.Types.ObjectId,
      ref: 'Candidate',
      required: [true, 'Candidate is required'],
    },
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job is required'],
    },
    scheduledAt: {
      type: Date,
      required: [true, 'Scheduled date is required'],
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled',
    },
    transcript: {
      type: String,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    feedback: {
      type: String,
    },
    recordingUrl: {
      type: String,
    },
    duration: {
      type: Number, // Duration in minutes
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
InterviewSchema.index({ candidate: 1, job: 1 });
InterviewSchema.index({ scheduledAt: 1 });

const Interview: Model<IInterview> =
  mongoose.models.Interview ||
  mongoose.model<IInterview>('Interview', InterviewSchema);

export default Interview;