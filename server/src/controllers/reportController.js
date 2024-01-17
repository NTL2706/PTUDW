import configEnv from "../configs/configEnv.js";
import { districtModel } from "../models/districtModel.js";
import { reportModel } from "../models/reportModel.js";
import { wardModel } from "../models/wardModel.js";
import { sendMail } from "../utils/mailUtil.js";
import { pagination } from "../utils/pagination.js";
import moment from 'moment';

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

async function formReport(req, res) {
    const idReport = req.query.id;
    const user = req.user;

    // if (!user) {
    //     return res.redirect("/auth/login");
    // }

    try {
        const report = await reportModel.findById(idReport).lean()
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
        if (report) {
            report.created_at = moment(report.created_at).format('YYYY-MM-DDTHH:mm:ss');
            return res.render("report/formReport", { report });
        } else {
            return res.redirect("/report/view");
        }
    } catch (error) {
        console.log(error);
        return res.redirect("/report/view");
    }
}

async function editReport(req, res) {
    const idReport = req.query.id;
    const user = req.user;
    const data = req.body;

    if (!user) {
        return res.redirect("/auth/login");
    }

    let dataUpdate = {}
    if (data.solution) dataUpdate.solution = data.solution;
    if (data.status) {
        dataUpdate.status = data.status
        // todo: send mail
        sendMail(user.email, "Update report status", `Currently the report is in a status of ${data.status}`)
    }

    try {
        await reportModel.findByIdAndUpdate(idReport, dataUpdate)
        return res.redirect("/report/view");
    } catch (error) {
        console.log(error);
        return res.redirect("/report/view");
    }
}


export {
    viewReport,
    formReport,
    editReport
}