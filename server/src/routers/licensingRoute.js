import { Router } from "express";
import { typeAdsModel } from "../models/typeModel.js";
import { typePlaceModel } from "../models/typePlaceModel.js";
import { create, view, approved, form } from "../controllers/licensingController.js";
import uploadCloud from "../middlewares/cloudinaryMiddleware.js";
import { licensingModel } from "../models/licensingModel.js";

const route = Router();

route.get("/view", view);
route.get("/form", form);
route.get("/create", async (req, res) => {
    try {
        const typeAds = await typeAdsModel.find().lean();
        const typePlace = await typePlaceModel.find().lean();

        res.render("licensing/create", { typeAds, typePlace });
    } catch (error) {
        console.log(error);
        res.redirect("/")
    }
})
route.post("/create", uploadCloud.single('image'), create)

route.get("/approved", approved);
route.get("/delete", async (req, res) => {
    const id = req.query.id || 1;
    try {
        await licensingModel.findByIdAndDelete(id);
        res.redirect("/licensing/view");
    } catch (error) {
        console.log(error);
        res.redirect("/")
    }
})

export default route;