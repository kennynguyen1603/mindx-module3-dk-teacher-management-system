import stream from 'stream';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '@/config/env/env.js';

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folder: string,
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'image',
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        delivery_type: 'upload',
        access_mode: 'public',
        transformation: [{ quality: 'auto:good' }],
      },
      (error: any, result: any) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }
        if (!result?.secure_url) {
          return reject(new Error('No secure URL returned from Cloudinary'));
        }
        resolve(result.secure_url);
      },
    );

    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);
    bufferStream.pipe(uploadStream);
  });
};
