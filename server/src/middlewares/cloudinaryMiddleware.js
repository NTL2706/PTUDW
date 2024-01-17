import { v2 } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import configEnv from '../configs/configEnv.js';
import multer from 'multer';

const cloudinary = v2

cloudinary.config({
    cloud_name: configEnv.CLOUDINARY_NAME,
    api_key: configEnv.CLOUDINARY_KEY,
    api_secret: configEnv.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: "test",
    },
});

const uploadCloud = multer({ storage, limits: { fieldSize: 25 * 1024 * 1024 } });

export default uploadCloud;