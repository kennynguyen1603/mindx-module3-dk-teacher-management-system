import { ObjectId } from 'mongodb';
import { teacherPositionRepository } from '@/repositories/teacherPosition.repository.js';
import { ITeacherPositionDocument } from '@/models/teacherPosition.model.js';
import { ConflictError, NotFoundError } from '@/core/error.response.js';

class TeacherPositionService {
  private static instance: TeacherPositionService;

  static getInstance(): TeacherPositionService {
    if (!TeacherPositionService.instance) {
      TeacherPositionService.instance = new TeacherPositionService();
    }
    return TeacherPositionService.instance;
  }

  /**
   * Create a new teacher position
   */
  async createPosition(data: {
    name: string;
    code: string;
    des: string;
    isActive?: boolean;
  }): Promise<any> {
    // Check if code already exists
    const existing = await teacherPositionRepository.findByCode(data.code);
    if (existing) {
      throw new ConflictError('Position code already exists');
    }

    const positionData: ITeacherPositionDocument = {
      name: data.name,
      code: data.code,
      des: data.des,
      isActive: data.isActive ?? true,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return teacherPositionRepository.create(positionData);
  }

  /**
   * Get position by ID
   */
  async getPosition(positionId: string): Promise<any> {
    const position = await teacherPositionRepository.findById(positionId);
    if (!position) {
      throw new NotFoundError('Position not found');
    }
    return position;
  }

  /**
   * List positions with pagination
   */
  async listPositions(
    filter?: { isActive?: boolean },
    page: number = 1,
    limit: number = 10,
  ): Promise<{ positions: any[]; total: number }> {
    const filterData: Partial<ITeacherPositionDocument> = {};
    if (filter?.isActive !== undefined) {
      filterData.isActive = filter.isActive;
    }

    return teacherPositionRepository.list(filterData, page, limit);
  }

  /**
   * Update position
   */
  async updatePosition(
    positionId: string,
    data: Partial<{
      name?: string;
      code?: string;
      des?: string;
      isActive?: boolean;
    }>,
  ): Promise<any> {
    const position = await teacherPositionRepository.findById(positionId);
    if (!position) {
      throw new NotFoundError('Position not found');
    }

    // Check if new code already exists (if code is being updated)
    if (data.code && data.code !== position.code) {
      const existing = await teacherPositionRepository.findByCode(data.code);
      if (existing) {
        throw new ConflictError('Position code already exists');
      }
    }

    const updateData: Partial<ITeacherPositionDocument> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.code !== undefined) updateData.code = data.code;
    if (data.des !== undefined) updateData.des = data.des;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const updated = await teacherPositionRepository.update(
      positionId,
      updateData,
    );
    if (!updated) {
      throw new NotFoundError('Failed to update position');
    }
    return updated;
  }

  /**
   * Delete position (soft delete)
   */
  async deletePosition(positionId: string): Promise<boolean> {
    const position = await teacherPositionRepository.findById(positionId);
    if (!position) {
      throw new NotFoundError('Position not found');
    }

    return teacherPositionRepository.delete(positionId);
  }

  /**
   * Get all active positions (for dropdowns)
   */
  async getAllActivePositions(): Promise<any[]> {
    const { positions } = await teacherPositionRepository.list(
      { isActive: true },
      1,
      1000,
    );
    return positions;
  }
}

export const teacherPositionService = TeacherPositionService.getInstance();
