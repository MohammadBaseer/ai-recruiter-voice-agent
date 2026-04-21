import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICandidate extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  location?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  resumeUrl?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  status: 'new' | 'contacted' | 'interviewed' | 'hired' | 'rejected';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    location: { type: String, trim: true },
    linkedInUrl: { type: String, trim: true },
    portfolioUrl: { type: String, trim: true },
    githubUrl: { type: String, trim: true },
    resumeUrl: { type: String },
    skills: [{ type: String, trim: true }],
    experience: { type: String },
    education: { type: String },
    status: {
      type: String,
      enum: ['new', 'contacted', 'interviewed', 'hired', 'rejected'],
      default: 'new',
    },
    notes: { type: String },
  },
  { timestamps: true },
);

const Candidate: Model<ICandidate> =
  mongoose.models.Candidate || mongoose.model<ICandidate>('Candidate', CandidateSchema);

export default Candidate;
