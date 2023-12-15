import { Router } from "express";
import { register } from "../../controllers/authController.js";
import { viewAds } from "../../controllers/adsController.js";
import passport from "passport";

const route = Router();

route.get("/view", viewAds);
route.get("/")

export default route;