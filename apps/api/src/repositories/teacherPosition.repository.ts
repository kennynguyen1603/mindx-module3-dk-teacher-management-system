import { Collection, ObjectId, WithId } from 'mongodb';
import { database } from '@/config/db/db.js';
import {
  ITeacherPositionDocument,
  TEACHER_POSITION_COLLECTION_NAME,
} from '@/models/teacherPosition.model.js';

const positionCollection = (): Collection<ITeacherPositionDocument> => {
  return database.database.collection<ITeacherPositionDocument>(
    TEACHER_POSITION_COLLECTION_NAME,
  );
};

export const teacherPositionRepository = {
  async create(
    data: ITeacherPositionDocument,
  ): Promise<WithId<ITeacherPositionDocument>> {
    const result = await positionCollection().insertOne(data);
    return { ...data, _id: result.insertedId };
  },

  async findById(id: string): Promise<WithId<ITeacherPositionDocument> | null> {
    return positionCollection().findOne({
      _id: new ObjectId(id),
      isDeleted: false,
    });
  },

  async findByCode(
    code: string,
  ): Promise<WithId<ITeacherPositionDocument> | null> {
    return positionCollection().findOne({ code });
  },

  async update(
    id: string,
    data: Partial<ITeacherPositionDocument>,
  ): Promise<WithId<ITeacherPositionDocument> | null> {
    const result = await positionCollection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' },
    );
    return result ?? null;
  },

  async delete(id: string): Promise<boolean> {
    const result = await positionCollection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { isDeleted: true, updatedAt: new Date() } },
      { returnDocument: 'after' },
    );
    return result !== null;
  },

  async list(
    filter: Partial<ITeacherPositionDocument> = {},
    page: number = 1,
    limit: number = 10,
  ): Promise<{ positions: WithId<ITeacherPositionDocument>[]; total: number }> {
    const skip = (page - 1) * limit;
    const baseFilter = { ...filter, isDeleted: false };

    const [positions, total] = await Promise.all([
      positionCollection()
        .find(baseFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      positionCollection().countDocuments(baseFilter),
    ]);

    return { positions, total };
  },

  async countTotal(
    filter: Partial<ITeacherPositionDocument> = {},
  ): Promise<number> {
    const baseFilter = { ...filter, isDeleted: false };
    return positionCollection().countDocuments(baseFilter);
  },

  getCollection(): Collection<ITeacherPositionDocument> {
    return positionCollection();
  },
};
