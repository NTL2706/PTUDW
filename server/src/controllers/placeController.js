import { placeModel, Place } from "../models/placeModel.js";
import { adsModel, Ads } from "../models/adsModel.js";
import configEnv from "../configs/configEnv.js";
import { pagination } from "../utils/pagination.js";
import { typePlaceModel } from "../models/typePlaceModel.js";

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
            .populate({
                path: 'ads.ad',
                model: 'Ads',
            })
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
        const typePlace = await typePlaceModel.find().lean();

        if (placeAds) {
            return res.render("place/formPlace", { placeAds, advertisements, typePlace, role: user.role });
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
    if (dataUpdate.ads) {
        if (Array.isArray(dataUpdate.ads))
            dataUpdate.ads = dataUpdate.ads.map(adId => {
                return {
                    ad: adId,
                    quantity: 1
                };
            })
        else dataUpdate.ads = {
            ad: dataUpdate.ads,
            quantity: 1
        }
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
        await placeModel.findByIdAndDelete(idAds);
        return res.redirect(`/place/view`);
    } catch (error) {
        console.log(error);
        return res.redirect("/ads/view");
    }
}

async function createPlace(req, res, next) {
    const data = req.body;

    const dataInsert = {
        address: data.address,
        lon: data.lon,
        lat: data.lat,
        type: data.type,
        ward: data.option
    }
    console.log(data)
    if (data.ads) {
        if (Array.isArray(data.ads))
            dataInsert.ads = data.ads.map(adId => {
                return {
                    ad: adId,
                    quantity: 1
                };
            })
        else dataInsert.ads = {
            ad: data.ads,
            quantity: 1
        }
    }

    try {
        await placeModel.insertMany(dataInsert);
        return res.redirect("/place/view");
    }
    catch (error) {
        console.log(error);
        return res.redirect("/place/view");
    }
}

export { viewPlace, formPlace, editPlace, deletePlace, createPlace };