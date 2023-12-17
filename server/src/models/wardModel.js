import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Ward = new Schema({
    name: String,
    district: {
        type: Schema.Types.ObjectId,
        ref: 'District'
    },

    createdAt: { type: Date, default: Date.now }
}, {
    collection: "Ward"
})

const wardModel = mongoose.model("Ward", Ward);

export { wardModel }
export { Ward }
