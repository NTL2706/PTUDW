import { Router } from "express";
import { placeAdsAPI, reportAPI } from "../../controllers/apiController.js";

const route = Router();

route.get("/placeAds", placeAdsAPI);
route.post("/report", reportAPI);

export default route;