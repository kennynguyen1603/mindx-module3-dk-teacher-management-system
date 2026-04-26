import multer from 'multer';
import path from 'path';
import { Request, RequestHandler } from 'express';

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (!file || !file.originalname) {
    return cb(null, false);
  }

  const imageFileTypes = /jpeg|jpg|png|gif|webp|heic/;
  const extname = imageFileTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = imageFileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp, heic)'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 20 },
});

export const uploadSingle = (fieldName: string): RequestHandler =>
  upload.single(fieldName) as unknown as RequestHandler;
export const uploadMultiple = (fieldName: string, maxCount: number = 5): RequestHandler =>
  upload.array(fieldName, maxCount) as unknown as RequestHandler;
export const uploadFields = (fields: { name: string; maxCount?: number }[]): RequestHandler =>
  upload.fields(fields) as unknown as RequestHandler;

export default upload;
