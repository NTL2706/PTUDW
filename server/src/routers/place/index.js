import { Router } from "express";
import { viewPlace, formPlace, editPlace, deletePlace, createPlace }
    from "../../controllers/placeController.js";
import { adsModel } from "../../models/adsModel.js";
import { typePlaceModel } from "../../models/typePlaceModel.js";
import { districtModel } from "../../models/districtModel.js";

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
        const typePlace = await typePlaceModel.find().select("_id name").lean();
        const district = await districtModel.find().select("_id name").lean();
        return res.render("place/createPlace", { advertisements, typePlace, district })
    } catch (error) {
        console.log(error);
        return res.redirect("/place/view");
    }
})

route.post("/create", createPlace);
route.post("/edit", editPlace);

export default route;