import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo_aicte_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789012345',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'abcdefghijklmnopqrstuvwxyz123456',
  secure: true,
});

/**
 * Upload buffer directly to Cloudinary via stream.
 * Gracefully falls back to inline data URL if Cloudinary keys are invalid/demo or offline.
 */
export const uploadToCloudinary = (fileBuffer, folder = 'aicte_pravah', filename = 'file', mimetype = 'image/jpeg') => {
  return new Promise((resolve) => {
    // If credentials are placeholder demo keys, provide reliable local data URI fallback
    if (
      !process.env.CLOUDINARY_API_KEY ||
      process.env.CLOUDINARY_API_KEY === '123456789012345' ||
      process.env.CLOUDINARY_CLOUD_NAME === 'demo_aicte_cloud'
    ) {
      const base64 = fileBuffer.toString('base64');
      const dataUri = `data:${mimetype};base64,${base64}`;
      return resolve({
        secure_url: dataUri,
        public_id: `${folder}/${filename}_${Date.now()}`,
        format: mimetype.split('/')[1] || 'bin',
        isFallback: true,
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          console.warn('[Cloudinary] Upload failed, falling back to data URI:', error.message);
          const base64 = fileBuffer.toString('base64');
          const dataUri = `data:${mimetype};base64,${base64}`;
          return resolve({
            secure_url: dataUri,
            public_id: `${folder}/${filename}_${Date.now()}`,
            format: mimetype.split('/')[1] || 'bin',
            isFallback: true,
          });
        }
        resolve(result);
      }
    );

    const stream = Readable.from(fileBuffer);
    stream.pipe(uploadStream);
  });
};

export default cloudinary;
