import { placeModel } from "../models/placeModel.js"

async function placeAdsAPI(req, res) {
    const projection = {
        createdAt: 0,
    }

    try {
        const placeAds = await placeModel
            .find({}, projection).lean()
            .populate({
                path: 'ads.ad',
                model: 'Ads',
            })
            .exec();

        return res.status(200).json({ "data": placeAds });
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({ msg: "fail" });
    }
}

async function reportAPI(req, res) {
    return res.status(200).json({ msg: "success" });
}

export {
    placeAdsAPI,
    reportAPI
}