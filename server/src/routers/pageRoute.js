import { Router } from "express";
import { homePage } from "../controllers/pageController.js"


const route = Router();
route.get("/", homePage)

export default route;