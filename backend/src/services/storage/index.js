import { env } from '../../config/env.js';
import { LocalStorageService } from './LocalStorageService.js';

let instance;

export function getStorageService() {
    if (instance) return instance;

    switch (env.STORAGE_DRIVER) {
        case 'local':
            instance = new LocalStorageService();
            break;
        // case 's3':
        //   instance = new S3StorageService();
        //   break;
        default:
            throw new Error(`Unknown STORAGE_DRIVER: ${env.STORAGE_DRIVER}`);
    }

    return instance;
}

export const storageService = getStorageService();