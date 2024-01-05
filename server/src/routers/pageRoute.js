import { Router } from "express";
import { loginPage, homePage } from "../controllers/pageController.js"

const route = Router();
route.get("/", homePage)
route.get("/login", loginPage)

export default route;