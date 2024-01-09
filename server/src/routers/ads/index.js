import { Router } from "express";
import { register } from "../../controllers/authController.js";
import { viewAds, formAds, editAds, deleteAds } from "../../controllers/adsController.js";
import passport from "passport";

const route = Router();

route.get("/view", viewAds);
route.get("/form", formAds)


export default route;