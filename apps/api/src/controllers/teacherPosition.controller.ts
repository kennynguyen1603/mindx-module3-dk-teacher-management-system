import { Request, Response } from 'express';
import { OkResponse, CreatedResponse } from '@/core/success.response.js';
import { teacherPositionService } from '@/services/teacherPosition.service.js';

class TeacherPositionController {
  create = async (req: Request, res: Response) => {
    const { name, code, des, isActive } = req.validated?.body ?? req.body;

    const position = await teacherPositionService.createPosition({
      name,
      code,
      des,
      isActive,
    });

    return new CreatedResponse({
      message: 'Position created successfully',
      data: { position },
    });
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.validated?.params ?? req.params;
    const position = await teacherPositionService.getPosition(id);

    return new OkResponse({
      message: 'Position retrieved successfully',
      data: { position },
    });
  };

  list = async (req: Request, res: Response) => {
    const { page, limit, isActive } = req.validated?.query ?? req.query;

    const result = await teacherPositionService.listPositions(
      {
        isActive: isActive as boolean | undefined,
      },
      page as number,
      limit as number,
    );

    return new OkResponse({
      message: 'Positions retrieved successfully',
      data: {
        positions: result.positions,
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
    const { name, code, des, isActive } = req.validated?.body ?? req.body;

    const position = await teacherPositionService.updatePosition(id, {
      name,
      code,
      des,
      isActive,
    });

    return new OkResponse({
      message: 'Position updated successfully',
      data: { position },
    });
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.validated?.params ?? req.params;
    await teacherPositionService.deletePosition(id);

    return new OkResponse({
      message: 'Position deleted successfully',
    });
  };

  /**
   * Get all active positions for dropdown/select
   */
  getAllActive = async (req: Request, res: Response) => {
    const positions = await teacherPositionService.getAllActivePositions();

    return new OkResponse({
      message: 'Active positions retrieved successfully',
      data: { positions },
    });
  };
}

export const teacherPositionController = new TeacherPositionController();
