import { Router } from "express";
import { placeAdsAPI, reportAPI } from "../../controllers/apiController.js";
import uploadCloud from "../../middlewares/cloudinaryMiddleware.js"

const route = Router();

route.get("/placeAds", placeAdsAPI);
route.post("/report", uploadCloud.single('image'), reportAPI);

export default route;