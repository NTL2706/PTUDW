import { adsChangeModel, placeChangeModel } from "../models/changeModel.js";
import configEnv from "../configs/configEnv.js";
import { pagination } from "../utils/pagination.js";
import moment from 'moment';
import { adsModel } from "../models/adsModel.js";
import { placeModel } from "../models/placeModel.js";

async function viewPlace(req, res, next) {
    const page = req.query.page || 1;
    const limit = configEnv.PAGE_SIZE;
    const user = req.user || null;

    if (!user) {
        return res.redirect("/auth/login");
    }

    try {
        const placeAds = await placeChangeModel.find().lean()
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(limit * page - limit)
            .populate({
                path: 'ads.ad',
                model: 'Ads',
            })
            .exec();


        const countPlace = await placeChangeModel.countDocuments();

        const totalPage = Math.ceil(countPlace / limit);

        const pages = pagination(totalPage, page)

        return res.render("change/viewPlace", { placeAds, pages, totalPage, role: user.role });
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
            return res.render("change/formPlace", { placeAds, advertisements, role: user.role });
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
    const data = req.body;

    if (!user) {
        return res.redirect("/auth/login");
    }
    console.log(data.ads)
    const dataInsert = {
        address: data.address,
        lon: data.lon,
        lat: data.lat,
        type: data.type,

    };
    dataInsert.idChange = idPlace;
    dataInsert.email = user.email;
    dataInsert.reason = data.reason;
    dataInsert.ads = data.ads.map(adId => {
        return {
            ad: adId,
            quantity: 1
        };
    })

    try {
        await placeChangeModel.insertMany(dataInsert);
        return res.redirect("/change/viewPlace")
    } catch (error) {
        console.log(error);
        return res.redirect("/ads/view");
    }
}

async function deletePlace(req, res, next) {
    const idAds = req.query.id;
    const user = req.user

    if (!user) {
        return res.redirect("/auth/login");
    }

    try {
        await placeChangeModel.findByIdAndDelete(idAds);
        return res.redirect(`/change/viewPlace`);
    } catch (error) {
        console.log(error);
        return res.redirect("/ads/view");
    }
}

async function approvePlace(req, res) {
    const idPlace = req.query.id;
    const user = req.user;

    if (!user) {
        return res.redirect("/auth/login");
    }

    try {
        const data = await placeChangeModel.findById(idPlace).lean()

        const dataUpdate = {
            address: data.address,
            lon: data.lon,
            lat: data.lat,
            type: data.type,
            ads: data.ads,
        };


        await placeModel.findByIdAndUpdate(data.idChange, dataUpdate);
        await placeChangeModel.findByIdAndUpdate(idPlace, { active: true });
        return res.redirect("/change/viewPlace")
    } catch (error) {
        console.log(error);
        return res.redirect("/ads/view");
    }
}

export { viewPlace, formPlace, editPlace, deletePlace, approvePlace }