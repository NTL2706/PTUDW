import { Router } from "express";
import { register } from "../controllers/authController.js";
import passport from "passport";
const route = Router();

route.post("/login", passport.authenticate("local", {
    successRedirect: '/',
    failureRedirect: '/login',
    failureMessage: true
}));

route.post("/register", register)

export default route;