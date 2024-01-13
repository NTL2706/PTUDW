import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Company = new Schema({
    name: String,
    email: Number,
    phone: Number,
    address: String,

    is_deleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}, {
    collection: "Company"
})

const companyModel = mongoose.model("Company", Company);

export { companyModel }
export { Company }
