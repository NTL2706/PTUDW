import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TypeAds = new Schema({
    name: String,
}, {
    collection: "TypeAds"
});

const typeAdsModel = mongoose.model('TypeAds', TypeAds);

const seedTypeAds = async () => {
    const defaultTypeAdsData = [
        { name: 'Trụ bảng hiflex' },
        { name: 'Trụ màn hình điện tử LED' },
        { name: 'Trụ hộp đèn' },
        { name: 'Bảng hiflex ốp tường' },
        { name: 'Màn hình điện tử ốp tường' },
        { name: 'Trụ treo băng rôn dọc' },
        { name: 'Trụ treo băng rôn ngang' },
        { name: 'Trụ/Cụm pano' },
        { name: 'Cổng chào' },
        { name: 'Trung tâm thương mại' },
    ];

    try {
        const count = await typeAdsModel.countDocuments();

        if (count === 0) {
            await typeAdsModel.create(defaultTypeAdsData);
        }
    } catch (error) {
        console.error(error);
    }
};

export { typeAdsModel, seedTypeAds }