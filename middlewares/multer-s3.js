import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

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
  filename = filename.replace(/ /g, "");
  filename = filename.replace(/#/g, "");
  filename = filename.replace(/\?/g, "");
  filename = filename.replace(/&/g, "");
  filename = filename.replace(/=/g, "");
  filename = filename.replace(/\+/g, "");

  return filename;
}


const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `${Date.now().toString()}${path.basename(file.originalname, ext)}${ext}`;
      const safeFilename = convertSafeFilename(filename);
      cb(null, `uploads/${safeFilename}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
  },
});

const uploadImageS3 = upload.single('image');

async function deleteImageFromS3(key) {
  const deleteParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  };

  try {
    const data = await s3.send(new DeleteObjectCommand(deleteParams));
  } catch (err) {
    console.error('Error deleting file:', err);
    throw new Error('Failed to delete file from S3');
  }
}

export { uploadImageS3, deleteImageFromS3 };