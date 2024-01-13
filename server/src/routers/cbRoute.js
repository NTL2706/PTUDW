import { Router } from "express";
import {
    createDistrict,
    createWard,
    getWard
} from "../controllers/cbController.js";
import { districtModel } from "../models/districtModel.js";

const route = Router();

route.get("/create-district", (req, res) => {
    if (!req.user || req.user.role !== "admin")
        return res.redirect("/auth/login");

    return res.render("cb/createDistrict");
});
route.post("/create-district", createDistrict);

route.get("/create-ward", async (req, res) => {
    if (!req.user || req.user.role !== "admin")
        return res.redirect("/auth/login");

    try {
        const districts = await districtModel.find().lean().select('_id name');
        return res.render("cb/createWard", { districts });
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
});
route.post("/create-ward", createWard);

route.get("/get-ward", getWard)

export default route;