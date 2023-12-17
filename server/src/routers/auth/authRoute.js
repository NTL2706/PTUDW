import { Router } from "express";
import {
    register,
    createAccount,
} from "../../controllers/authController.js";
import passport from "passport";
import { districtModel } from "../../models/districtModel.js";

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
route.post("/register", register);

route.get("/create-account-district", async (req, res) => {
    if (!req.user || req.user.role !== "admin")
        return res.render("auth/login");

    try {
        const district = await districtModel.find().select("_id name").lean();
        return res.render("auth/createAccountDistrict", { district });
    } catch (error) {
        console.log(error)
        return res.redirect("/")
    }
})
route.get("/create-account-ward", async (req, res) => {
    if (!req.user || req.user.role !== "admin")
        return res.render("auth/login");

    try {
        const district = await districtModel.find().select("_id name").lean();
        return res.render("auth/createAccountWard", { district });
    } catch (error) {
        console.log(error)
        return res.redirect("/")
    }
})
route.post("/create-account", createAccount);
export default route;