import { config } from "dotenv"
config();

const configEnv = {
    "PORT": process.env.PORT,
    "MONGOURL": process.env.MONGOURL,
    "SALTROUNDS": process.env.SALTROUNDS,
    "SESSION_SECRET": process.env.SESSION_SECRET,
    "PAGE_SIZE": 4,
    "CLOUDINARY_NAME": process.env.CLOUDINARY_NAME,
    "CLOUDINARY_KEY": process.env.CLOUDINARY_KEY,
    "CLOUDINARY_SECRET": process.env.CLOUDINARY_SECRET,
}

export default configEnv;

