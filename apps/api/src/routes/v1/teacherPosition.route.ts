import { Router } from 'express';
import { teacherPositionController } from '@/controllers/teacherPosition.controller.js';
import { validate } from '@/middlewares/validate.middleware.js';
import { wrapAsyncHandler } from '@/utils/asyncHandler.js';
import {
  createTeacherPositionSchema,
  updateTeacherPositionSchema,
  listTeacherPositionSchema,
  getTeacherPositionSchema,
  deleteTeacherPositionSchema,
} from '@/validations/teacherPosition.validation.js';

const teacherPositionRouter: Router = Router();

// Create position
teacherPositionRouter.post(
  '/',
  validate(createTeacherPositionSchema),
  wrapAsyncHandler(teacherPositionController.create),
);

// Get all active positions (for dropdown) - must be before /:id
teacherPositionRouter.get(
  '/active',
  wrapAsyncHandler(teacherPositionController.getAllActive),
);

// List positions with pagination
teacherPositionRouter.get(
  '/',
  validate(listTeacherPositionSchema),
  wrapAsyncHandler(teacherPositionController.list),
);

// Get position by ID
teacherPositionRouter.get(
  '/:id',
  validate(getTeacherPositionSchema),
  wrapAsyncHandler(teacherPositionController.getById),
);

// Update position
teacherPositionRouter.patch(
  '/:id',
  validate(updateTeacherPositionSchema),
  wrapAsyncHandler(teacherPositionController.update),
);

// Delete position
teacherPositionRouter.delete(
  '/:id',
  validate(deleteTeacherPositionSchema),
  wrapAsyncHandler(teacherPositionController.delete),
);

export default teacherPositionRouter;
