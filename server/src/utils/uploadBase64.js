import { v2 } from 'cloudinary';

const cloudinary = v2

const uploadBase64ToCloudinary = async (base64Data) => {
    try {
        const imageBuffer = Buffer.from(base64Data.split(',')[1], 'base64');

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'report' }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }).end(imageBuffer);
        });

        return result;
    } catch (error) {
        throw error;
    }
};

export default uploadBase64ToCloudinary