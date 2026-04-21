import { Request, Response } from 'express';
import { OkResponse, CreatedResponse } from '@/core/success.response.js';
import { teacherService } from '@/services/teacher.service.js';
import { RESPONSE_MESSAGES } from '@/utils/constants.js';
import { ObjectId } from 'mongodb';

class TeacherController {
  create = async (req: Request, res: Response) => {
    const {
      name,
      email,
      phoneNumber,
      address,
      identity,
      dob,
      positions,
      degrees,
      isActive,
      startDate,
      endDate,
    } = req.validated?.body ?? req.body;

    const positionIds = positions?.map((id: string) => new ObjectId(id)) || [];

    const teacher = await teacherService.createTeacher({
      name,
      email,
      phoneNumber,
      address,
      identity,
      dob: new Date(dob),
      positions: positionIds,
      degrees,
      isActive,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
    });

    return new CreatedResponse({
      message: 'Teacher created successfully',
      data: { teacher },
    });
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.validated?.params ?? req.params;
    const teacher = await teacherService.getTeacher(id);

    return new OkResponse({
      message: 'Teacher retrieved successfully',
      data: { teacher },
    });
  };

  list = async (req: Request, res: Response) => {
    const { page, limit, search, isActive } = req.validated?.query ?? req.query;

    const result = await teacherService.listTeachers(
      {
        search: search as string | undefined,
        isActive: isActive as boolean | undefined,
      },
      page as number,
      limit as number,
    );

    return new OkResponse({
      message: 'Teachers retrieved successfully',
      data: {
        teachers: result.teachers,
        pagination: {
          page: page as number,
          limit: limit as number,
          total: result.total,
        },
      },
    });
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.validated?.params ?? req.params;
    const {
      name,
      email,
      phoneNumber,
      address,
      identity,
      dob,
      positions,
      degrees,
      isActive,
      startDate,
      endDate,
    } = req.validated?.body ?? req.body;

    const positionIds =
      positions?.map((posId: string) => new ObjectId(posId)) || undefined;

    const teacher = await teacherService.updateTeacher(id, {
      name,
      email,
      phoneNumber,
      address,
      identity,
      dob: dob ? new Date(dob) : undefined,
      positions: positionIds,
      degrees,
      isActive,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    return new OkResponse({
      message: 'Teacher updated successfully',
      data: { teacher },
    });
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.validated?.params ?? req.params;
    await teacherService.deleteTeacher(id);

    return new OkResponse({
      message: 'Teacher deleted successfully',
    });
  };
}

export const teacherController = new TeacherController();
