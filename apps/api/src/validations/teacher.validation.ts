import { z } from 'zod';

const degreeSchema = z.object({
  type: z
    .string({ message: 'Degree type is required' })
    .min(1, 'Degree type is required')
    .max(100, 'Degree type must be at most 100 characters'),
  school: z
    .string({ message: 'School is required' })
    .min(1, 'School is required')
    .max(100, 'School must be at most 100 characters'),
  major: z
    .string({ message: 'Major is required' })
    .min(1, 'Major is required')
    .max(100, 'Major must be at most 100 characters'),
  year: z
    .number({ message: 'Year must be a number' })
    .int('Year must be an integer')
    .min(1900, 'Year must be 1900 or later')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
  isGraduated: z.boolean({ message: 'Graduation status is required' }),
});

export const createTeacherSchema = {
  body: z.object({
    name: z
      .string({ message: 'Name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be at most 100 characters')
      .trim(),
    email: z
      .string({ message: 'Email is required' })
      .trim()
      .toLowerCase()
      .pipe(z.email('Invalid email address')),
    phoneNumber: z
      .string({ message: 'Phone number is required' })
      .regex(/^[0-9]{10,11}$/, 'Phone number must be 10-11 digits')
      .trim(),
    address: z
      .string({ message: 'Address is required' })
      .min(5, 'Address must be at least 5 characters')
      .max(255, 'Address must be at most 255 characters')
      .trim(),
    identity: z
      .string({ message: 'Identity is required' })
      .regex(/^[0-9]{9,12}$/, 'Identity must be 9-12 digits')
      .trim(),
    dob: z
      .string({ message: 'Date of birth is required' })
      .pipe(z.coerce.date('Invalid date of birth')),
    positions: z
      .array(z.string().min(24, 'Invalid position ID'), {
        message: 'Positions must be an array',
      })
      .optional()
      .default([]),
    degrees: z
      .array(degreeSchema, { message: 'Degrees must be an array' })
      .optional()
      .default([]),
    isActive: z
      .boolean({ message: 'Active status must be a boolean' })
      .default(true),
    startDate: z
      .string({ message: 'Start date is required' })
      .pipe(z.coerce.date('Invalid start date')),
    endDate: z
      .string({ message: 'End date is required' })
      .pipe(z.coerce.date('Invalid end date'))
      .optional(),
  }),
};

export const updateTeacherSchema = {
  body: z.object({
    name: z
      .string({ message: 'Name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be at most 100 characters')
      .trim()
      .optional(),
    email: z
      .string({ message: 'Email is required' })
      .trim()
      .toLowerCase()
      .pipe(z.email('Invalid email address'))
      .optional(),
    phoneNumber: z
      .string({ message: 'Phone number is required' })
      .regex(/^[0-9]{10,11}$/, 'Phone number must be 10-11 digits')
      .trim()
      .optional(),
    address: z
      .string({ message: 'Address is required' })
      .min(5, 'Address must be at least 5 characters')
      .max(255, 'Address must be at most 255 characters')
      .trim()
      .optional(),
    identity: z
      .string({ message: 'Identity is required' })
      .regex(/^[0-9]{9,12}$/, 'Identity must be 9-12 digits')
      .trim()
      .optional(),
    dob: z
      .string({ message: 'Date of birth is required' })
      .pipe(z.coerce.date('Invalid date of birth'))
      .optional(),
    positions: z
      .array(z.string().min(24, 'Invalid position ID'), {
        message: 'Positions must be an array',
      })
      .optional(),
    degrees: z
      .array(degreeSchema, { message: 'Degrees must be an array' })
      .optional(),
    isActive: z
      .boolean({ message: 'Active status must be a boolean' })
      .optional(),
    startDate: z
      .string({ message: 'Start date is required' })
      .pipe(z.coerce.date('Invalid start date'))
      .optional(),
    endDate: z
      .string({ message: 'End date is required' })
      .pipe(z.coerce.date('Invalid end date'))
      .optional(),
  }),
};

export const listTeacherSchema = {
  query: z.object({
    page: z
      .string({ message: 'Page must be a number' })
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .pipe(
        z
          .number()
          .int('Page must be an integer')
          .min(1, 'Page must be at least 1'),
      ),
    limit: z
      .string({ message: 'Limit must be a number' })
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .pipe(
        z
          .number()
          .int('Limit must be an integer')
          .min(1, 'Limit must be at least 1')
          .max(100, 'Limit must be at most 100'),
      ),
    search: z.string({ message: 'Search must be a string' }).optional(),
    isActive: z
      .enum(['true', 'false'], { message: 'isActive must be true or false' })
      .transform((val) => val === 'true')
      .optional(),
  }),
};

export const getTeacherSchema = {
  params: z.object({
    id: z
      .string({ message: 'Teacher ID is required' })
      .min(24, 'Invalid teacher ID'),
  }),
};

export const deleteTeacherSchema = {
  params: z.object({
    id: z
      .string({ message: 'Teacher ID is required' })
      .min(24, 'Invalid teacher ID'),
  }),
};
