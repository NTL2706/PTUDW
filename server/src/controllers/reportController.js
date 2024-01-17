import { func } from "joi";
import configEnv from "../configs/configEnv.js";
import { districtModel } from "../models/districtModel.js";
import { reportModel } from "../models/reportModel.js";
import { wardModel } from "../models/wardModel.js";
import { pagination } from "../utils/pagination.js";

async function viewReport(req, res) {
    const user = req.user;
    const page = req.query.page || 1;
    const limit = configEnv.PAGE_SIZE;

    if (!user) return res.redirect("/auth/login");

    try {
        let filter = {}
        console.log(user)
        if (user.role == "ward") {
            const ward_user = await wardModel.findById(user.option.ward);
            filter.ward = ward_user.name.toLowerCase();
        }
        else if (user.role == "district") {
            const district_user = await districtModel.findById(user.option.ward);
            filter.district = district_user.name.toLowerCase();
        }
        console.log(filter)

        const report = await reportModel.find(filter).lean()
            .sort({ created_at: -1 })
            .limit(limit)
            .skip(limit * page - limit)
            .populate([
                {
                    path: 'ads',
                    model: 'Ads',
                },
                {
                    path: 'place',
                    model: 'Place'
                }
            ])
            .exec();

        const countReport = await reportModel.countDocuments(filter);

        const totalPage = Math.ceil(countReport / limit);

        const pages = pagination(totalPage, page)

        res.render("report/viewReport", { report, pages, totalPage });
    } catch (error) {
        console.log(error);
        res.redirect("/view")
    }
}

export {
    viewReport
}