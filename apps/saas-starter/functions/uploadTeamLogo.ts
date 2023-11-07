import { UploadImageResponse, UploadTeamLogo } from '@teamkeel/sdk';
import { v2 as cloudinary } from 'cloudinary';

export default UploadTeamLogo(async (ctx, inputs): Promise<UploadImageResponse> => {
    cloudinary.config({
        cloud_name: ctx.secrets.CLOUDINARY_CLOUD_NAME,
        api_key: ctx.secrets.CLOUDINARY_API_KEY,
        api_secret: ctx.secrets.CLOUDINARY_API_SECRET,
    });

    try {
        const uploadResponse = await cloudinary.uploader.upload(inputs.base64Image);
        const imageUrl = uploadResponse.secure_url;

        return {
            path: imageUrl
        };
    } catch (error) {
        console.error(error);
        throw { error }
    }
})