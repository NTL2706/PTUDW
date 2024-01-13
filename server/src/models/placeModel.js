import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Place = new Schema({
    address: String,
    long: Number,
    lat: Number,
    type: String,

    ads: {
        type: Schema.Types.ObjectId,
        ref: 'Ads'
    },

    ward: String,
    district: String,

    is_deleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}, {
    collection: "Place"
})

const placeModel = mongoose.model("Place", Place);

export { placeModel }
export { Place }
