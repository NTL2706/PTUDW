import { Router } from "express";
import {
    viewAds,
    formAds,
    editAds,
    createAds,
    deleteAds
} from "../../controllers/adsController.js";
import uploadCloud from "../../middlewares/cloudinaryMiddleware.js"
import { typeAdsModel } from "../../models/typeModel.js"

const route = Router();

route.get("/view", viewAds);
route.get("/form", formAds)
route.get("/delete", deleteAds);
route.get("/create", async (req, res) => {
    if (!req.user || req.user.role !== "admin") {
        return res.redirect("/auth/login");
    }
    const typeAds = await typeAdsModel.find().select("name").lean();
    return res.render("ads/createAds", { typeAds });
})

route.post("/create", uploadCloud.single('image'), createAds);
route.post("/edit", uploadCloud.single('image'), editAds);

export default route;