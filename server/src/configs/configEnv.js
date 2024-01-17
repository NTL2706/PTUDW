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
    "MAIL_USER_NAME": process.env.MAIL_USER_NAME,
    "MAIL_PASSWORD": process.env.MAIL_PASSWORD,
}

export default configEnv;

