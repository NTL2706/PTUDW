import { Router } from "express";
import { placeAdsAPI } from "../../controllers/apiController.js";

const route = Router();

route.get("/placeAds", placeAdsAPI);

export default route;