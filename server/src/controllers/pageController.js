import { districtModel } from "../models/districtModel.js";
import passport from "passport";

export async function homePage(req, res) {
    if (!req.user) {
        res.redirect("/auth/login");
    } else {
        const districts = await districtModel.find().lean().select('_id name');
        res.render("index", { districts, name: req.user.name, role: req.user.role });
    }

}