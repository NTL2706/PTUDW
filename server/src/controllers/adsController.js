import { adsModel, Ads } from "../models/adsModel.js";
import configEnv from "../configs/configEnv.js";
import { pagination } from "../utils/pagination.js";

async function viewAds(req, res, next) {
    const page = req.param("page") || 1;
    const limit = configEnv.PAGE_SIZE;
    const user = req.user;

    console.log(user)
    if (!user) {
        res.redirect("/auth/login");
    }
    try {
        const advertisements = await adsModel.find().lean()
            .sort({ created_at: -1 })
            .limit(limit)
            .skip(limit * page - limit);

        const totalPage = await adsModel.countDocuments();
        console.log(advertisements);
        console.log(totalPage);

        const pages = pagination(totalPage, page)
        console.log(pages)

        return res.render("ads/viewAds", { advertisements, pages, totalPage, role: user.role });
    }
    catch (error) {
        console.log(error)
        return res.render("ads/viewAds")
    }
}

export { viewAds }