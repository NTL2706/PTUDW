import { placeModel } from "../models/placeModel.js"
import uploadBase64ToCloudinary from "../utils/uploadBase64.js";
import { reportModel } from "../models/reportModel.js";
import getAddressDetails from "../utils/address.js";

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
    const data = req.body;
    let dataInsert = {
        email: data.email,
        name: data.name,
        phone: data.phone,
        ads: data.idad !== 'undefined' ? data.idad : null,
        place: data.idplace !== 'undefined' ? data.idplace : null,
        urlImg1: "",
        urlImg2: "",
        context: data.context ?? "",
        address: data.address,

        status: "Confirm",
        solution: "",
        ward: "",
        district: "",
    }

    const address = getAddressDetails(data.address);

    dataInsert.ward = address.ward.toLowerCase();
    dataInsert.district = address.district.toLowerCase();;

    if (data?.image) {
        try {
            const image = await uploadBase64ToCloudinary(data.image);
            dataInsert.urlImg1 = image.url
        } catch (error) {
            console.log(error)
            return res.status(400).json({ msg: "fail" });
        }
    }

    try {
        await reportModel.insertMany(dataInsert)
        return res.status(200).json({ msg: "success" });
    } catch (error) {
        console.log(error)
        return res.status(400).json({ msg: "fail" });
    }
}

export {
    placeAdsAPI,
    reportAPI
}