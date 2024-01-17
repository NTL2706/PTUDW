import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Place = new Schema({
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
    createdAt: { type: Date, default: Date.now }
}, {
    collection: "Place"
})

const placeModel = mongoose.model("Place", Place);

export { placeModel }
export { Place }
