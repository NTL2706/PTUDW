import { Router } from "express";
import {
    viewAds,
    formAds,
    editAds,
    deleteAds,
    approveAds
} from "../../controllers/changeAdsController.js";
import uploadCloud from "../../middlewares/cloudinaryMiddleware.js"
import {
    viewPlace, formPlace, editPlace, deletePlace, approvePlace
} from "../../controllers/changePlaceController.js";

const route = Router();

route.get("/viewAds", viewAds);
route.get("/formAds", formAds);
route.get("/deleteAds", deleteAds);
route.get("/approveAds", approveAds);

route.post("/editAds", uploadCloud.single('image'), editAds);

route.get("/viewPlace", viewPlace);
route.get("/formPlace", formPlace);
route.get("/deletePlace", deletePlace);
route.get("/approvePlace", approvePlace);

route.post("/editPlace", uploadCloud.single('image'), editPlace);

export default route;