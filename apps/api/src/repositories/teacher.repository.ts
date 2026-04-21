import { Collection, ObjectId, WithId } from 'mongodb';
import { database } from '@/config/db/db.js';
import {
  ITeacherDocument,
  TEACHER_COLLECTION_NAME,
} from '@/models/teacher.model.js';
import { IUserDocument, USER_COLLECTION_NAME } from '@/models/user.model.js';
import { TEACHER_POSITION_COLLECTION_NAME } from '@/models/teacherPosition.model.js';

interface ITeacherWithUser extends ITeacherDocument {
  user?: WithId<IUserDocument>;
  positionDetails?: Array<any>;
}

const teacherCollection = (): Collection<ITeacherDocument> => {
  return database.database.collection<ITeacherDocument>(
    TEACHER_COLLECTION_NAME,
  );
};

export const teacherRepository = {
  async create(data: ITeacherDocument): Promise<WithId<ITeacherDocument>> {
    const result = await teacherCollection().insertOne(data);
    return { ...data, _id: result.insertedId };
  },

  async findById(id: string): Promise<WithId<ITeacherDocument> | null> {
    return teacherCollection().findOne({
      _id: new ObjectId(id),
      isDeleted: false,
    });
  },

  async findByUserId(userId: string): Promise<WithId<ITeacherDocument> | null> {
    return teacherCollection().findOne({
      userId: new ObjectId(userId),
      isDeleted: false,
    });
  },

  async findByCode(code: string): Promise<WithId<ITeacherDocument> | null> {
    return teacherCollection().findOne({ code });
  },

  async update(
    id: string,
    data: Partial<ITeacherDocument>,
  ): Promise<WithId<ITeacherDocument> | null> {
    const result = await teacherCollection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' },
    );
    return result ?? null;
  },

  async delete(id: string): Promise<boolean> {
    const result = await teacherCollection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { isDeleted: true, updatedAt: new Date() } },
      { returnDocument: 'after' },
    );
    return result !== null;
  },

  async list(
    filter: Partial<ITeacherDocument> = {},
    page: number = 1,
    limit: number = 10,
  ): Promise<{ teachers: WithId<ITeacherDocument>[]; total: number }> {
    const skip = (page - 1) * limit;
    const baseFilter = { ...filter, isDeleted: false };

    const [teachers, total] = await Promise.all([
      teacherCollection()
        .find(baseFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      teacherCollection().countDocuments(baseFilter),
    ]);

    return { teachers, total };
  },

  async aggregateTeachers(
    pipeline: Array<any> = [],
    page: number = 1,
    limit: number = 10,
  ): Promise<{ teachers: any[]; total: number }> {
    const skip = (page - 1) * limit;

    const baseStage = {
      $match: { isDeleted: false },
    };

    // Build aggregation pipeline
    const aggregationPipeline = [
      baseStage,
      ...pipeline,
      {
        $lookup: {
          from: USER_COLLECTION_NAME,
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: TEACHER_POSITION_COLLECTION_NAME,
          localField: 'positions',
          foreignField: '_id',
          as: 'positionDetails',
        },
      },
      {
        $project: {
          _id: 1,
          code: 1,
          name: '$user.name',
          email: '$user.email',
          phoneNumber: '$user.phoneNumber',
          address: '$user.address',
          identity: '$user.identity',
          isActive: 1,
          positions: 1,
          positionDetails: 1,
          degrees: 1,
          startDate: 1,
          endDate: 1,
          createdAt: 1,
          user: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          count: [{ $count: 'total' }],
        },
      },
    ];

    const result = await teacherCollection()
      .aggregate(aggregationPipeline)
      .toArray();

    const teachers = result[0]?.data || [];
    const total = result[0]?.count[0]?.total || 0;

    return { teachers, total };
  },

  async countTotal(filter: Partial<ITeacherDocument> = {}): Promise<number> {
    const baseFilter = { ...filter, isDeleted: false };
    return teacherCollection().countDocuments(baseFilter);
  },

  getCollection(): Collection<ITeacherDocument> {
    return teacherCollection();
  },
};
