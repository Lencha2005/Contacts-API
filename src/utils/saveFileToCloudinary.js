import cloudinary from 'cloudinary';
import fs from "node:fs/promises";
import { getEnvVar } from './getEnvVar.js';

const cloud_name = getEnvVar("CLOUD_NAME");
const api_key = getEnvVar("API_KEY");
const api_secret = getEnvVar("API_SECRET");

cloudinary.v2.config({
    secure: true,
    cloud_name,
    api_key,
    api_secret,
})

export const saveFileToCloudinary = async file => {
    const response = await cloudinary.v2.uploader.upload(file.path, {
        folder: "photo"
    });
    await fs.unlink(file.path);
    return response.secure_url;
};
