import mongoose from "mongoose";
import ENV from "./configEnv.js"

mongoose.connect(ENV.MONGOURL).then(()=>{
    console.log (`connected to db`);
});
