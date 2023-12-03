import {config} from "dotenv"
config();

const configEnv = {
    "PORT": process.env.PORT,
    "MONGOURL":process.env.MONGOURL,
    "SALTROUNDS":process.env.SALTROUNDS,
    "SESSION_SECRET":process.env.SESSION_SECRET
}

export default configEnv;

