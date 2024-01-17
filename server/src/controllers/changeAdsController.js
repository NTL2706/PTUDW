import { adsChangeModel } from "../models/changeModel.js";
import configEnv from "../configs/configEnv.js";
import { pagination } from "../utils/pagination.js";
import moment from 'moment';
import { adsModel } from "../models/adsModel.js";

async function viewAds(req, res, next) {
    const page = req.query.page || 1;
    const limit = configEnv.PAGE_SIZE;
    const user = req.user;

    if (!user) {
        return res.redirect("/auth/login");
    }

    try {
        const advertisements = await adsChangeModel.find().lean()
            .sort({ created_at: -1 })
            .limit(limit)
            .skip(limit * page - limit);

        const countAds = await adsChangeModel.countDocuments();

        const totalPage = Math.ceil(countAds / limit);

        const pages = pagination(totalPage, page)
        return res.render("change/viewAds", { advertisements, pages, totalPage, role: user.role });
    }
    catch (error) {
        console.log(error)
        return res.render("ads/viewAds")
    }
}

async function formAds(req, res, next) {
    const idAds = req.query.id;
    const user = req.user;

    // if (!user) {
    //     return res.redirect("/auth/login");
    // }

    try {
        const advertisement = await adsModel.findById(idAds).lean();

        if (advertisement) {
            advertisement.start_date = moment(advertisement.start_date).format('YYYY-MM-DDTHH:mm:ss');
            advertisement.end_date = moment(advertisement.end_date).format('YYYY-MM-DDTHH:mm:ss');

            return res.render("change/formAds", { advertisement, role: user.role });
        } else {
            return res.redirect("/ads/view");
        }
    } catch (error) {
        console.log(error);
        return res.redirect("/ads/view");
    }
}

async function editAds(req, res, next) {
    const idAds = req.query.id;
    const user = req.user;
    const dataUpdate = req.body;
    const image = req.file;

    if (!user) {
        return res.redirect("/auth/login");
    }

    dataUpdate.start_date = new Date(dataUpdate.start_date);
    dataUpdate.end_date = new Date(dataUpdate.end_date);

    if (image) dataUpdate.urlImg = image.path;

    try {
        await adsModel.findByIdAndUpdate(idAds, dataUpdate);
        // return res.redirect(`/ads/form?id=${idAds}`);
        return res.redirect("/ads/view")
    } catch (error) {
        console.log(error);
        return res.redirect("/ads/view");
    }
}

async function deleteAds(req, res, next) {
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

export { viewAds, formAds, editAds, deleteAds }