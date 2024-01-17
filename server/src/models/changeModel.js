import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AdsChange = new Schema({
    type: String,
    height: Number,
    width: Number,
    content: String,
    urlImg: String,

    start_date: Date,
    end_date: Date,

    company: String,

    createdAt: { type: Date, default: Date.now },
    active: { type: Boolean, default: false },
    idChange: String,
    reason: String,
    email: String,
}, {
    collection: "AdsChange"
})

const PlaceChange = new Schema({
    address: String,
    lon: Number,
    lat: Number,
    type: String,

    ads: [{
        ad: { type: Schema.Types.ObjectId, ref: 'Ads' },
        quantity: Number
    }],

    ward: { type: Schema.Types.ObjectId, ref: 'Ward' },

    is_deleted: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
    active: { type: Boolean, default: false },
    idChange: String,
    reason: String,
}, {
    collection: "PlaceChange"
})

const placeChangeModel = mongoose.model("PlaceChange", PlaceChange);
const adsChangeModel = mongoose.model("AdsChange", AdsChange);

export { adsChangeModel, placeChangeModel }
