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

    if (!user) {
        return res.redirect("/auth/login");
    }

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
    dataUpdate.idChange = idAds
    dataUpdate.email = user.email

    try {
        const adsOld = await adsModel.findById(idAds)
        if (image) dataUpdate.urlImg = image.path;
        else dataUpdate.urlImg = adsOld.urlImg;


        await adsChangeModel.insertMany(dataUpdate);
        return res.redirect("/change/viewAds")
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
        await adsChangeModel.findByIdAndDelete(idAds);
        return res.redirect(`/change/viewAds`);
    } catch (error) {
        console.log(error);
        return res.redirect("/ads/view");
    }
}

async function approveAds(req, res) {
    const idAds = req.query.id;
    const user = req.user;

    if (!user) {
        return res.redirect("/auth/login");
    }

    try {
        const adsEdit = await adsChangeModel.findById(idAds).lean()

        const dataUpdate = {
            type: adsEdit.type,
            height: adsEdit.height,
            width: adsEdit.width,
            content: adsEdit.content,
            urlImg: adsEdit.urlImg,

            start_date: adsEdit.start_date,
            end_date: adsEdit.end_date,

            company: adsEdit.company,
        }

        console.log(adsEdit)

        await adsModel.findByIdAndUpdate(adsEdit.idChange, dataUpdate);
        await adsChangeModel.findByIdAndUpdate(idAds, { active: true });
        // return res.redirect(`/ads/form?id=${idAds}`);
        return res.redirect("/ads/view")
    } catch (error) {
        console.log(error);
        return res.redirect("/ads/view");
    }
}

export { viewAds, formAds, editAds, deleteAds, approveAds }