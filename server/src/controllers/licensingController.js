import configEnv from "../configs/configEnv.js";
import { adsModel } from "../models/adsModel.js";
import { licensingModel } from "../models/licensingModel.js";
import { placeModel } from "../models/placeModel.js";
import { pagination } from "../utils/pagination.js";
import moment from 'moment';

async function create(req, res) {
    const user = req.user;
    const data = req.body;
    const img = req.file;

    let dataInsert = {
        address: data.address,
        lon: data.lon,
        lat: data.lat,
        type: data.type,

        typeAds: data.typeAds,
        height: data.height,
        width: data.width,
        content: data.content,
        urlImg: img.path,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),

        company: {
            name: data.companyName,
            email: data.companyEmail,
            phone: data.companyPhone
        },
    }

    try {
        await licensingModel.insertMany(dataInsert);
        res.redirect("/licensing/view");
    } catch (error) {
        console.log(error);
        res.redirect("/")
    }
}

async function view(req, res) {
    const page = req.query.page || 1;
    const limit = configEnv.PAGE_SIZE;
    const user = req.user || null;

    if (!user)
        return res.redirect("/auth/login");

    try {
        const licensing = await licensingModel.find().lean()
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(limit * page - limit)
            .exec();

        const countAds = await adsModel.countDocuments();

        const totalPage = Math.ceil(countAds / limit);

        const pages = pagination(totalPage, page)

        res.render("licensing/view", { licensing, pages, totalPage, role: user.role });
    } catch (error) {
        console.log(error);
        res.redirect("/")
    }
}

async function approved(req, res) {
    const id = req.query.id || 1;


    try {
        const licensing = await licensingModel.findById(id);

        const dataAds = {
            type: licensing.typeAds,
            height: licensing.height,
            width: licensing.width,
            content: licensing.content,
            urlImg: licensing.urlImg,
            start_date: licensing.start_date,
            end_date: licensing.end_date,
            company: licensing.company.name,
        }
        const ads = await adsModel.insertMany(dataAds);

        const dataPlace = {
            address: licensing.address,
            lon: licensing.lon,
            lat: licensing.lat,
            type: licensing.type,
            ads: [{
                ad: ads[0]._id,
                quantity: 1
            }],

            ward: null
        }
        await placeModel.insertMany(dataPlace);
        await licensingModel.findByIdAndUpdate(id, { active: true });
        res.redirect("/licensing/view");
    } catch (error) {
        console.log(error);
        res.redirect("/")
    }
}

async function form(req, res) {
    const id = req.query.id || 1;
    const user = req.user || null;

    try {
        const licensing = await licensingModel.findById(id).lean()
        licensing.start_date = moment(licensing.start_date).format('YYYY-MM-DDTHH:mm:ss');
        licensing.end_date = moment(licensing.end_date).format('YYYY-MM-DDTHH:mm:ss');

        res.render("licensing/form", { licensing, role: user.role });
    } catch (error) {
        console.log(error);
        res.redirect("/")
    }
}

export {
    create,
    view,
    approved,
    form
}