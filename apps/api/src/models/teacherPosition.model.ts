import { ObjectId } from 'mongodb';
import { database } from '@/config/db/db.js';

export const TEACHER_POSITION_COLLECTION_NAME = 'teacher_positions';

export interface ITeacherPositionDocument {
  _id?: ObjectId;
  name: string;
  code: string; // unique
  des: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function createTeacherPositionIndexes(): Promise<void> {
  const collection = database.database.collection(
    TEACHER_POSITION_COLLECTION_NAME,
  );

  await collection.createIndexes([
    { key: { code: 1 }, unique: true, name: 'idx_code_unique' },
    { key: { isDeleted: 1 }, name: 'idx_isDeleted' },
    { key: { isActive: 1 }, name: 'idx_isActive' },
    { key: { createdAt: -1 }, name: 'idx_createdAt' },
  ]);
}
