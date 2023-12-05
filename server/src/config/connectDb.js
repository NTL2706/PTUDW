import mongoose from "mongoose";
import dotConfig from "./configEnv.js"

mongoose.connect(dotConfig.MONGOURL).then(() => {
    console.log(`connected to db`);
});
