import mongoose from "mongoose";

const Schema = mongoose.Schema;

const District = new Schema({
    name: String,

    createdAt: { type: Date, default: Date.now }
}, {
    collection: "District"
})

const districtModel = mongoose.model("District", District);

export { districtModel }
export { District }
