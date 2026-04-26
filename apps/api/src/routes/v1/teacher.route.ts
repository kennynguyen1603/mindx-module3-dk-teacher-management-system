import { Router } from 'express';
import { teacherController } from '@/controllers/teacher.controller.js';
import { validate } from '@/middlewares/validate.middleware.js';
import { wrapAsyncHandler } from '@/utils/asyncHandler.js';
import { uploadSingle } from '@/config/upload/multer.js';
import {
  createTeacherSchema,
  updateTeacherSchema,
  listTeacherSchema,
  getTeacherSchema,
  deleteTeacherSchema,
} from '@/validations/teacher.validation.js';

const teacherRouter: Router = Router();

// Upload avatar — must be before /:id routes
teacherRouter.post(
  '/upload-avatar',
  uploadSingle('avatar'),
  wrapAsyncHandler(teacherController.uploadAvatar),
);

// Create teacher
teacherRouter.post(
  '/',
  validate(createTeacherSchema),
  wrapAsyncHandler(teacherController.create),
);

// List teachers with pagination
teacherRouter.get(
  '/',
  validate(listTeacherSchema),
  wrapAsyncHandler(teacherController.list),
);

// Get teacher by ID
teacherRouter.get(
  '/:id',
  validate(getTeacherSchema),
  wrapAsyncHandler(teacherController.getById),
);

// Update teacher
teacherRouter.patch(
  '/:id',
  validate(updateTeacherSchema),
  wrapAsyncHandler(teacherController.update),
);

// Delete teacher
teacherRouter.delete(
  '/:id',
  validate(deleteTeacherSchema),
  wrapAsyncHandler(teacherController.delete),
);

export default teacherRouter;
