import { Router } from "express";
import {
    viewAds,
    formAds,
    editAds,
    deleteAds
} from "../../controllers/changeAdsController.js";
import uploadCloud from "../../middlewares/cloudinaryMiddleware.js"

const route = Router();

route.get("/view", viewAds);
route.get("/formAds", formAds)
route.get("/delete", deleteAds);

route.post("/edit", uploadCloud.single('image'), editAds);

export default route;