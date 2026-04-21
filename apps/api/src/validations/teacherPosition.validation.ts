import { z } from 'zod';

export const createTeacherPositionSchema = {
  body: z.object({
    name: z
      .string({ message: 'Name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be at most 100 characters')
      .trim(),
    code: z
      .string({ message: 'Code is required' })
      .min(1, 'Code is required')
      .max(50, 'Code must be at most 50 characters')
      .trim(),
    des: z
      .string({ message: 'Description is required' })
      .min(5, 'Description must be at least 5 characters')
      .max(500, 'Description must be at most 500 characters')
      .trim(),
    isActive: z
      .boolean({ message: 'Active status must be a boolean' })
      .default(true),
  }),
};

export const updateTeacherPositionSchema = {
  body: z.object({
    name: z
      .string({ message: 'Name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be at most 100 characters')
      .trim()
      .optional(),
    code: z
      .string({ message: 'Code is required' })
      .min(1, 'Code is required')
      .max(50, 'Code must be at most 50 characters')
      .trim()
      .optional(),
    des: z
      .string({ message: 'Description is required' })
      .min(5, 'Description must be at least 5 characters')
      .max(500, 'Description must be at most 500 characters')
      .trim()
      .optional(),
    isActive: z
      .boolean({ message: 'Active status must be a boolean' })
      .optional(),
  }),
};

export const listTeacherPositionSchema = {
  query: z.object({
    page: z.coerce
      .number({ message: 'Page must be a number' })
      .int('Page must be an integer')
      .min(1, 'Page must be at least 1')
      .optional()
      .default(1),
    limit: z.coerce
      .number({ message: 'Limit must be a number' })
      .int('Limit must be an integer')
      .min(1, 'Limit must be at least 1')
      .max(100, 'Limit must be at most 100')
      .optional()
      .default(10),
    isActive: z
      .enum(['true', 'false'], { message: 'isActive must be true or false' })
      .transform((val) => val === 'true')
      .optional(),
  }),
};


export const getTeacherPositionSchema = {
  params: z.object({
    id: z
      .string({ message: 'Position ID is required' })
      .min(24, 'Invalid position ID'),
  }),
};

export const deleteTeacherPositionSchema = {
  params: z.object({
    id: z
      .string({ message: 'Position ID is required' })
      .min(24, 'Invalid position ID'),
  }),
};
