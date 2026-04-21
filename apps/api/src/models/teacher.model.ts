import { ObjectId } from 'mongodb';
import { database } from '@/config/db/db.js';

export const TEACHER_COLLECTION_NAME = 'teachers';

export interface IDegree {
  type: string;
  school: string;
  major: string;
  year: number;
  isGraduated: boolean;
}

export interface ITeacherDocument {
  _id?: ObjectId;
  userId: ObjectId;
  code: string; // 10-digit unique code
  isActive: boolean;
  isDeleted: boolean;
  startDate: Date;
  endDate?: Date;
  positions: ObjectId[]; // ref to teacher_positions
  degrees: IDegree[];
  createdAt: Date;
  updatedAt: Date;
}

export async function createTeacherIndexes(): Promise<void> {
  const collection = database.database.collection(TEACHER_COLLECTION_NAME);

  await collection.createIndexes([
    { key: { code: 1 }, unique: true, name: 'idx_code_unique' },
    { key: { userId: 1 }, unique: true, name: 'idx_userId_unique' },
    { key: { isDeleted: 1 }, name: 'idx_isDeleted' },
    { key: { isActive: 1 }, name: 'idx_isActive' },
    { key: { positions: 1 }, name: 'idx_positions' },
    { key: { createdAt: -1 }, name: 'idx_createdAt' },
  ]);
}
