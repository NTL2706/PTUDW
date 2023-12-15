import { Router } from "express";
import { register } from "../../controllers/authController.js";
import passport from "passport";

const route = Router();

route.get("/login", (req, res, next) => {
    // if (!req.user) {
    //     return res.render("auth/login");
    // }
    // else {
    //     return res.redirect('/');;
    // }
    return res.render("auth/login");
})
route.post("/login", passport.authenticate("local", {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureMessage: true
}));


// route.get("/register", (req, res, next) => {
//     if (!req.user) {
//         res.render("auth/register");
//     }
//     else {
//         res.redirect('/');;
//     }
// })
route.post("/register", register)

export default route;