import { Router } from "express";
import { viewPlace, formPlace, editPlace, deletePlace } from "../../controllers/placeController.js";
import { adsModel } from "../../models/adsModel.js";

const route = Router();

route.get("/view", viewPlace);
route.get("/form", formPlace)
route.get("/delete", deletePlace);
route.get("/create", async (req, res) => {
    if (!req.user || req.user.role !== "admin") {
        return res.redirect("/auth/login");
    }
    try {
        const advertisements = await adsModel.find().select('_id type').lean();
        return res.render("place/createPlace", { advertisements })
    } catch (error) {
        console.log(error);
        return res.redirect("/place/view");
    }
})

// route.post("/create", createAds);
route.post("/edit", editPlace);

export default route;