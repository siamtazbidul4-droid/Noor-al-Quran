import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'node:crypto';

// Connection state tracking
let isConnected = false;
let connectionError: string | null = null;

export async function initDatabase(): Promise<{ isConnected: boolean; error: string | null }> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    connectionError = 'MONGODB_URI not set. Running in local guest mode; database persistence unconfigured.';
    console.log('[Database]', connectionError);
    return { isConnected: false, error: connectionError };
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    connectionError = null;
    console.log('[Database] Connected successfully to MongoDB.');
    return { isConnected: true, error: null };
  } catch (err: any) {
    isConnected = false;
    connectionError = err.message || 'Failed to connect to MongoDB';
    console.warn('[Database] MongoDB connection error:', connectionError);
    return { isConnected: false, error: connectionError };
  }
}

export function getDatabaseStatus() {
  return {
    isConnected,
    error: connectionError,
    readyState: mongoose.connection.readyState,
  };
}

// User Schema
export interface IUser extends Document {
  displayName: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  displayName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  salt: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// Bookmark Schema
export interface IBookmark extends Document {
  userId: string;
  surahNumber: number;
  ayahNumber: number;
  note?: string;
  createdAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>({
  userId: { type: String, required: true, index: true },
  surahNumber: { type: Number, required: true, min: 1, max: 114 },
  ayahNumber: { type: Number, required: true, min: 1 },
  note: { type: String, default: '' },
}, { timestamps: true });

BookmarkSchema.index({ userId: 1, surahNumber: 1, ayahNumber: 1 }, { unique: true });

export const BookmarkModel = mongoose.models.Bookmark || mongoose.model<IBookmark>('Bookmark', BookmarkSchema);

// Reading Progress Schema
export interface IProgress extends Document {
  userId: string;
  lastSurah: number;
  lastAyah: number;
  completedSurahs: number[];
  completedJuz: number[];
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>({
  userId: { type: String, required: true, unique: true, index: true },
  lastSurah: { type: Number, default: 1, min: 1, max: 114 },
  lastAyah: { type: Number, default: 1, min: 1 },
  completedSurahs: [{ type: Number }],
  completedJuz: [{ type: Number }],
}, { timestamps: true });

export const ProgressModel = mongoose.models.Progress || mongoose.model<IProgress>('Progress', ProgressSchema);

// Audit Log Schema
export interface IAuditLog extends Document {
  actor: string;
  action: string;
  target: string;
  outcome: 'SUCCESS' | 'FAILURE';
  details?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  actor: { type: String, required: true },
  action: { type: String, required: true },
  target: { type: String, required: true },
  outcome: { type: String, enum: ['SUCCESS', 'FAILURE'], default: 'SUCCESS' },
  details: { type: String },
}, { timestamps: true });

export const AuditLogModel = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

// Password Hashing Helpers
export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
}
