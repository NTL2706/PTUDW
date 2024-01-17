import { adsModel, Ads } from "../models/adsModel.js";
import configEnv from "../configs/configEnv.js";
import { pagination } from "../utils/pagination.js";
import moment from 'moment';

async function viewAds(req, res, next) {
    const page = req.query.page || 1;
    const limit = configEnv.PAGE_SIZE;
    const user = req.user;

    if (!user) {
        return res.redirect("/auth/login");
    }

    try {
        const advertisements = await adsModel.find().lean()
            .sort({ created_at: -1 })
            .limit(limit)
            .skip(limit * page - limit);

        const countAds = await adsModel.countDocuments();

        const totalPage = Math.ceil(countAds / limit);

        const pages = pagination(totalPage, page)
        return res.render("ads/viewAds", { advertisements, pages, totalPage, role: user.role });
    }
    catch (error) {
        console.log(error)
        return res.render("ads/viewAds")
    }
}

async function formAds(req, res, next) {
    const idAds = req.query.id;
    const user = req.user;

    if (!user) {
        return res.redirect("/auth/login");
    }

    try {
        const advertisement = await adsModel.findById(idAds).lean();

        if (advertisement) {
            advertisement.start_date = moment(advertisement.start_date).format('YYYY-MM-DDTHH:mm:ss');
            advertisement.end_date = moment(advertisement.end_date).format('YYYY-MM-DDTHH:mm:ss');

            return res.render("ads/formAds", { advertisement, role: user.role });
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

async function createAds(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        return res.redirect("/auth/login");
    }

    let data = req.body;
    const img = req.file;

    const dataInsert = {
        type: data.type,
        height: data.height,
        width: data.width,
        content: data.content,
        urlImg: img.path,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
        company: "Company B",
    }

    try {
        await adsModel.insertMany(dataInsert);
        return res.redirect("/ads/view");
    } catch (error) {
        console.log(error);
        return res.redirect("/ads/view");
    }
}

export { viewAds, formAds, editAds, deleteAds, createAds }