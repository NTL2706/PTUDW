import { placeModel, Place } from "../models/placeModel.js";
import { adsModel, Ads } from "../models/adsModel.js";
import configEnv from "../configs/configEnv.js";
import { pagination } from "../utils/pagination.js";

async function viewPlace(req, res, next) {
    const page = req.query.page || 1;
    const limit = configEnv.PAGE_SIZE;
    const user = req.user || null;

    if (!user) {
        return res.redirect("/auth/login");
    }

    try {
        const placeAds = await placeModel.find().lean()
            .sort({ created_at: -1 })
            .limit(limit)
            .skip(limit * page - limit)
            .populate('ads')
            .exec();


        const countPlace = await placeModel.countDocuments();

        const totalPage = Math.ceil(countPlace / limit);

        const pages = pagination(totalPage, page)

        return res.render("place/viewPlace", { placeAds, pages, totalPage, role: user.role });
    }
    catch (error) {
        console.log(error)
        return res.render("place/viewPlace")
    }
}

async function formPlace(req, res, next) {
    const idAds = req.query.id;
    const user = req.user;

    if (!user) {
        return res.redirect("/auth/login");
    }

    try {
        const placeAds = await placeModel.findById(idAds).lean().populate('ads').exec();
        const advertisements = await adsModel.find().select('_id type').lean();

        if (placeAds) {
            return res.render("place/formPlace", { placeAds, advertisements, role: user.role });
        } else {
            return res.redirect("/place/view");
        }
    } catch (error) {
        console.log(error);
        return res.redirect("/place/view");
    }
}

async function editPlace(req, res, next) {
    const idPlace = req.query.id;
    const user = req.user;
    const dataUpdate = req.body;

    if (!user) {
        return res.redirect("/auth/login");
    }

    try {
        await placeModel.findByIdAndUpdate(idPlace, dataUpdate);
        return res.redirect(`/place/view`);
    } catch (error) {
        console.log(error);
        return res.redirect("/place/view");
    }
}

async function deletePlace(req, res, next) {
    const idAds = req.query.id;
    const user = req.user

    if (!user) {
        return res.redirect("/auth/login");
    }

    try {
        await adsModel.findByIdAndDelete(idAds);
        return res.redirect(`/ads/view`);
    } catch (error) {
        console.log(error);
        return res.redirect("/ads/view");
    }
}

export { viewPlace, formPlace, editPlace, deletePlace };