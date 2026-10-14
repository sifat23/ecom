/**
 * Storage interface. Any implementation (local, S3, GCS) must satisfy this.
 * Controllers NEVER touch Multer or cloud SDKs directly — only this interface.
 */
export class StorageService {
    /* eslint-disable no-unused-vars */
    async upload(file, destinationPath) { throw new Error('Not implemented'); }
    async delete(path)                  { throw new Error('Not implemented'); }
    getUrl(path)                        { throw new Error('Not implemented'); }
    /* eslint-enable no-unused-vars */
}