import { districtModel } from "../models/districtModel.js";
import passport from "passport";

export async function homePage(req, res) {
    if (!req.user) {
        res.redirect("/auth/login");
    } else {
        const user = req.user;
        if (user.role === 'ward') {
        }
        else if (user.role === 'district') {
        }
        else { }
        console.log(user);
        const districts = await districtModel.find().lean().select('_id name');
        res.render("index", { districts, name: req.user.name, role: req.user.role });
    }

}