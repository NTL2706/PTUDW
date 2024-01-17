import mongoose from "mongoose";

const Schema = mongoose.Schema;
// {
//     data,
//     email,
//     name,
//     phone,
//     _id -> (place),
//     _id -> (ads),
//     image -> (muti 2 image),
//     context
// }
const Report = new Schema({
    email: String,
    name: String,
    phone: String,
    ads: { type: Schema.Types.ObjectId, ref: 'Ads' },
    place: { type: Schema.Types.ObjectId, ref: 'Place' },
    createdAt: { type: Date, default: Date.now },
    urlImg1: String,
    urlImg2: String,
    context: String,

    ward: String,
    district: String,

    address: String,

    status: String,
    solution: String,
}, {
    collection: "Report"
});

const reportModel = mongoose.model('Report', Report);

export { reportModel, Report }