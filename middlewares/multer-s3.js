import { S3Client, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import fs from 'fs';
import dotenv from 'dotenv';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

if (fs.existsSync('.env')) {
  dotenv.config();
}

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const convertSafeFilename = (filename) => {
  return filename.replace(/ /g, "").replace(/#/g, "").replace(/\?/g, "").replace(/&/g, "").replace(/=/g, "").replace(/\+/g, "");
};


const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
  },
});

const uploadImageS3 = (req, res, next) => {
  const uploadMiddleware = upload.single('image');
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (req.file) {
      try {
        const compressedImageBuffer = await sharp(req.file.buffer)
          .jpeg({ quality: 80 })
          .toBuffer();

        const ext = '.png';
        const filename = `${uuidv4()}${ext}`;
        const safeFilename = convertSafeFilename(filename);

        await s3.send(new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: `uploads/${safeFilename}`,
          Body: compressedImageBuffer,
          ContentType: 'image/jpeg',
        }));
        req.file.key = `uploads/${safeFilename}`;
        next();
      } catch (compressErr) {
        return res.status(500).json({ error: 'Failed to compress and upload image' });
      }
    } else {
      next(); // no image file
    }
  });
};

async function deleteImageFromS3(req, res, next) {
  const key = req.imageKeyToDelete;
  if (!key) {
    return next();
  }
  try {
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };
    await s3.send(new DeleteObjectCommand(deleteParams));
    next();
  } catch (err) {
    console.error('Error deleting file:', err);
    return next(new Error('Failed to delete file from S3'));
  }
}

export { uploadImageS3, deleteImageFromS3 };