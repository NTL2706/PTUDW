import { districtModel } from "../models/districtModel.js"
import { wardModel } from "../models/wardModel.js"

async function createDistrict(req, res) {
    const user = req.user;
    const data = req.body;

    if (!user || user.role !== "admin") return res.redirect("/auth/login");

    try {
        await districtModel.insertMany(data);
        return res.redirect("/cb/viewDistrict");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

async function createWard(req, res) {
    const user = req.user;
    const data = req.body;

    if (!user || user.role !== "admin") return res.redirect("/auth/login");

    try {
        await wardModel.insertMany(data);
        return res.redirect(`/cb/viewWard?id=${data.district}`);
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

async function getWard(req, res) {
    const district = req.query.district || null;
    try {
        const result = await wardModel.find({ "district": district }).select("_id name").lean();
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(400).json();
    }
}

export {
    createDistrict,
    createWard,
    getWard
};