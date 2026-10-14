import fs from 'node:fs/promises';
import path from 'node:path';
import { StorageService } from './StorageService.js';
import { env } from '../../config/env.js';

export class LocalStorageService extends StorageService {
    constructor(rootDir = env.UPLOAD_DIR) {
        super();
        this.root = rootDir;
    }

    /** @param {{buffer: Buffer, originalname: string}} file */
    async upload(file, destinationPath = 'products') {
        const dir = path.join(this.root, destinationPath);
        await fs.mkdir(dir, { recursive: true });

        const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const absPath = path.join(dir, safeName);

        await fs.writeFile(absPath, file.buffer);

        const relPath = `/uploads/${destinationPath}/${safeName}`;
        return { url: relPath, path: relPath };
    }

    async delete(relPath) {
        const cleaned = relPath.replace(/^\/uploads\//, '');
        const absPath = path.join(this.root, cleaned);
        // Guard against path traversal
        if (!absPath.startsWith(path.resolve(this.root))) {
            throw new Error('Invalid storage path');
        }
        await fs.rm(absPath, { force: true });
    }

    getUrl(relPath) {
        return relPath; // nginx serves /uploads/* directly
    }
}