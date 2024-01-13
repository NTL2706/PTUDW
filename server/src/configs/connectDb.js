import mongoose from "mongoose";
import dotConfig from "./configEnv.js"
import { seedTypeAds } from "../models/typeModel.js";
import { seedTypePlace } from "../models/typePlaceModel.js";

mongoose.connect(dotConfig.MONGOURL).then(async () => {
    console.log(`connected to db`);
    await seedTypeAds();
    await seedTypePlace();
});
