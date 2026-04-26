import { ObjectId } from 'mongodb';
import { teacherRepository } from '@/repositories/teacher.repository.js';
import { teacherPositionRepository } from '@/repositories/teacherPosition.repository.js';
import { userRepository } from '@/repositories/user.repository.js';

import { ITeacherDocument, IDegree } from '@/models/teacher.model.js';
import { IUserDocument } from '@/models/user.model.js';
import { UserStatus, UserRole, AuthProvider } from '@mern/shared';
import { ConflictError, NotFoundError } from '@/core/error.response.js';

class TeacherService {
  private static instance: TeacherService;

  static getInstance(): TeacherService {
    if (!TeacherService.instance) {
      TeacherService.instance = new TeacherService();
    }
    return TeacherService.instance;
  }

  private async generateUniqueTeacherCode(): Promise<string> {
    let code: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      code = Math.floor(Math.random() * 10000000000)
        .toString()
        .padStart(10, '0');
      const existing = await teacherRepository.findByCode(code);
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error('Failed to generate unique teacher code');
    }

    return code!;
  }

  async createTeacher(data: {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    identity: string;
    dob: Date;
    positions?: ObjectId[];
    degrees?: IDegree[];
    isActive?: boolean;
    startDate: Date;
    endDate?: Date;
    avatar?: string;
  }): Promise<any> {
    const existingUser = await userRepository.findByEmail(
      data.email.toLowerCase().trim(),
    );
    if (existingUser) {
      throw new ConflictError('Email already exists');
    }

    const userData: IUserDocument = {
      name: data.name,
      email: data.email.toLowerCase().trim(),
      phoneNumber: data.phoneNumber,
      address: data.address,
      identity: data.identity,
      dob: data.dob,
      avatar: data.avatar,
      role: UserRole.TEACHER,
      status: UserStatus.ACTIVE,
      isEmailVerified: false,
      authProvider: AuthProvider.LOCAL,
      providers: [AuthProvider.LOCAL],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdUser = await userRepository.create(userData);

    try {
      const teacherCode = await this.generateUniqueTeacherCode();

      const teacherData: ITeacherDocument = {
        userId: createdUser._id!,
        code: teacherCode,
        isActive: data.isActive ?? true,
        isDeleted: false,
        startDate: data.startDate,
        endDate: data.endDate,
        positions: data.positions || [],
        degrees: data.degrees || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createdTeacher = await teacherRepository.create(teacherData);

      return {
        ...createdTeacher,
        user: createdUser,
      };
    } catch (error) {
      await userRepository.deleteById(createdUser._id!.toString());
      throw error;
    }
  }

  async getTeacher(teacherId: string): Promise<any> {
    const teacher = await teacherRepository.findById(teacherId);
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    const user = await userRepository.findById(teacher.userId.toString());
    if (!user) {
      throw new NotFoundError('Associated user not found');
    }

    const positionDetails: any[] = [];
    if (teacher.positions && teacher.positions.length > 0) {
      const fetchedPositions = await Promise.all(
        teacher.positions.map(async (posId: any) => {
          return teacherPositionRepository.findById(posId.toString());
        }),
      );
      positionDetails.push(...fetchedPositions.filter((p) => p !== null));
    }

    return {
      _id: teacher._id,
      code: teacher.code,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      identity: user.identity || '',
      dob: user.dob,
      avatar: user.avatar || null,
      isActive: teacher.isActive,
      positions: positionDetails,
      degrees: teacher.degrees,
      startDate: teacher.startDate,
      endDate: teacher.endDate,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
    };
  }

  async listTeachers(
    filter?: {
      search?: string;
      isActive?: boolean;
    },
    page: number = 1,
    limit: number = 10,
  ): Promise<{ teachers: any[]; total: number }> {
    const aggregationPipeline: any[] = [];

    if (filter?.search) {
      aggregationPipeline.push({
        $match: {
          $or: [{ code: { $regex: filter.search, $options: 'i' } }],
        },
      });
    }

    if (filter?.isActive !== undefined) {
      aggregationPipeline.push({
        $match: { isActive: filter.isActive },
      });
    }

    const result = await teacherRepository.aggregateTeachers(
      aggregationPipeline,
      page,
      limit,
    );

    const enrichedTeachers = result.teachers.map((teacher: any) => ({
      _id: teacher._id,
      code: teacher.code,
      name: teacher.user?.name || '',
      email: teacher.user?.email || '',
      phoneNumber: teacher.user?.phoneNumber || '',
      address: teacher.user?.address || '',
      identity: teacher.user?.identity || '',
      dob: teacher.user?.dob,
      avatar: teacher.user?.avatar || null,
      isActive: teacher.isActive,
      positions: teacher.positionDetails || [],
      degrees: teacher.degrees || [],
      startDate: teacher.startDate,
      endDate: teacher.endDate,
      createdAt: teacher.createdAt,
    }));

    return {
      teachers: enrichedTeachers,
      total: result.total,
    };
  }

  async updateTeacher(
    teacherId: string,
    data: Partial<{
      name?: string;
      email?: string;
      phoneNumber?: string;
      address?: string;
      identity?: string;
      dob?: Date;
      positions?: ObjectId[];
      degrees?: IDegree[];
      isActive?: boolean;
      startDate?: Date;
      endDate?: Date;
      avatar?: string;
    }>,
  ): Promise<any> {
    const teacher = await teacherRepository.findById(teacherId);
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    const userUpdateData: Partial<IUserDocument> = {};
    const teacherUpdateData: Partial<ITeacherDocument> = {};

    if (data.name !== undefined) userUpdateData.name = data.name;
    if (data.email !== undefined)
      userUpdateData.email = data.email.toLowerCase().trim();
    if (data.phoneNumber !== undefined)
      userUpdateData.phoneNumber = data.phoneNumber;
    if (data.address !== undefined) userUpdateData.address = data.address;
    if (data.identity !== undefined) userUpdateData.identity = data.identity;
    if (data.dob !== undefined) userUpdateData.dob = data.dob;
    if (data.avatar !== undefined) userUpdateData.avatar = data.avatar;

    if (data.positions !== undefined)
      teacherUpdateData.positions = data.positions;
    if (data.degrees !== undefined) teacherUpdateData.degrees = data.degrees;
    if (data.isActive !== undefined) teacherUpdateData.isActive = data.isActive;
    if (data.startDate !== undefined)
      teacherUpdateData.startDate = data.startDate;
    if (data.endDate !== undefined) teacherUpdateData.endDate = data.endDate;

    if (Object.keys(userUpdateData).length > 0) {
      await userRepository.updateById(
        teacher.userId.toString(),
        userUpdateData,
      );
    }

    const updatedTeacher = await teacherRepository.update(
      teacherId,
      teacherUpdateData,
    );
    if (!updatedTeacher) {
      throw new NotFoundError('Failed to update teacher');
    }

    const user = await userRepository.findById(teacher.userId.toString());

    const positionDetails: any[] = [];
    if (updatedTeacher.positions && updatedTeacher.positions.length > 0) {
      const fetchedPositions = await Promise.all(
        updatedTeacher.positions.map(async (posId: any) => {
          return teacherPositionRepository.findById(posId.toString());
        }),
      );
      positionDetails.push(...fetchedPositions.filter((p) => p !== null));
    }

    return {
      _id: updatedTeacher._id,
      code: updatedTeacher.code,
      name: user?.name,
      email: user?.email,
      phoneNumber: user?.phoneNumber || '',
      address: user?.address || '',
      identity: user?.identity || '',
      dob: user?.dob,
      avatar: user?.avatar || null,
      isActive: updatedTeacher.isActive,
      positions: positionDetails,
      degrees: updatedTeacher.degrees,
      startDate: updatedTeacher.startDate,
      endDate: updatedTeacher.endDate,
      createdAt: updatedTeacher.createdAt,
      updatedAt: updatedTeacher.updatedAt,
    };
  }

  async deleteTeacher(teacherId: string): Promise<boolean> {
    const teacher = await teacherRepository.findById(teacherId);
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    return teacherRepository.delete(teacherId);
  }
}

export const teacherService = TeacherService.getInstance();
