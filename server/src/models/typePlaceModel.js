import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TypePlace = new Schema({
    name: String,
}, {
    collection: "TypePlace"
});

const typePlaceModel = mongoose.model('TypePlace', TypePlace);

const seedTypePlace = async () => {
    const defaultTypeAdsData = [
        { name: 'Đất công/Công viên/Hành lang an toàn giao thông' },
        { name: 'Đất tư nhân/Nhà ở riêng lẻ' },
        { name: 'Trung tâm thương mại' },
        { name: ' Chợ' },
        { name: 'Cây xăng' },
        { name: 'Nhà chờ xe buýt' },
    ];

    try {
        const count = await typePlaceModel.countDocuments();

        if (count === 0) {
            await typePlaceModel.create(defaultTypeAdsData);
        }
    } catch (error) {
        console.error(error);
    }
};

export { typePlaceModel, seedTypePlace }