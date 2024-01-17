import { Router } from "express";
import {
    createDistrict,
    createWard,
    getWard
} from "../controllers/cbController.js";
import { districtModel } from "../models/districtModel.js";
import { wardModel } from "../models/wardModel.js";

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

route.get("/viewDistrict", async (req, res) => {
    if (!req.user || req.user.role !== "admin")
        return res.redirect("/auth/login");

    try {
        const district = await districtModel.find().lean()
        return res.render("cb/viewDistrict", { district });
    } catch (error) {
        console.log(error);
        return res.redirect("/")
    }
})

route.get("/viewWard", async (req, res) => {
    const district = req.query.id || null;
    try {
        const ward = await wardModel.find({ "district": district }).select("_id name").lean();
        return res.render("cb/viewWard", { ward });
    } catch (error) {
        console.log(error);
        return res.status(400).json();
    }
})

route.get("/editDistrict", async (req, res) => {
    if (!req.user || req.user.role !== "admin")
        return res.redirect("/auth/login");

    try {
        const district = await districtModel.findById(req.query.id).lean()
        return res.render("cb/editDistrict", { district });
    } catch (error) {
        console.log(error);
        return res.redirect("/")
    }
})
route.post("/editDistrict", async (req, res) => {
    const name = req.body.name;
    const id = req.query.id || null;



    try {
        const district = await districtModel.findByIdAndUpdate(id, { name }).lean()
        return res.redirect("/cb/viewDistrict");
    } catch (error) {
        console.log(error);
        return res.redirect("/")
    }
})
route.get("/deleteDistrict", async (req, res) => {
    const id = req.query.id || null;

    try {
        const district = await districtModel.findByIdAndDelete(id)
        return res.redirect("/cb/viewDistrict");
    } catch (error) {
        console.log(error);
        return res.redirect("/")
    }
})

route.get("/editWard", async (req, res) => {
    if (!req.user || req.user.role !== "admin")
        return res.redirect("/auth/login");

    try {
        const ward = await wardModel.findById(req.query.id).lean()
            .populate([
                {
                    path: 'district',
                    model: 'District',
                }
            ])
            .exec()
        return res.render("cb/editWard", { ward });
    } catch (error) {
        console.log(error);
        return res.redirect("/")
    }
})
route.post("/editWard", async (req, res) => {
    const name = req.body.name;
    const id = req.query.id || null;

    try {
        const district = await wardModel.findByIdAndUpdate(id, { name }).lean()
        return res.redirect(`/cb/viewWard?id=${req.body.district}`);
    } catch (error) {
        console.log(error);
        return res.redirect("/")
    }
})
route.get("/deleteWard", async (req, res) => {
    const id = req.query.id || null;

    try {
        const district = await wardModel.findById(id)
        await wardModel.findByIdAndDelete(id)
        return res.redirect(`/cb/viewWard?id=${district.district}`);
    } catch (error) {
        console.log(error);
        return res.redirect("/")
    }
})

export default route;