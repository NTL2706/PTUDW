import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Ads = new Schema({
    type: String,
    height: Number,
    width: Number,
    content: String,
    urlImg: String,
    start_date: Date,
    end_date: Date,
    company: String,

    createdAt: { type: Date, default: Date.now }
}, {
    collection: "Ads"
})

const adsModel = mongoose.model("Ads", Ads);

export { adsModel }
export { Ads }
