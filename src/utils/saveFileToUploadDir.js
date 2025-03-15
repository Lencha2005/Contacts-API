import path from 'node:path';
import fs from 'node:fs/promises';
import { UPLOAD_DIR } from '../constants/index.js';
import { getEnvVar } from './getEnvVar.js';

export const saveFileToUploadDir = async file => {
    const newPath = path.join(UPLOAD_DIR, file.filename);
    await fs.rename(file.path, newPath);
    return `${getEnvVar("APP_DOMAIN")}/uploads/${file.filename}`;
};
