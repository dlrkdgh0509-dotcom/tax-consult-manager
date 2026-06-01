export const FILE_BUCKET = "customer-files";

export function createStoragePath(customerId: string, fileName: string) {
    const extension = getFileExtension(fileName);
    const timestamp = Date.now();
    const randomText = Math.random().toString(36).slice(2, 10);

    return `active/${customerId}/${timestamp}_${randomText}${extension}`;
}

function getFileExtension(fileName: string) {
    const lastDotIndex = fileName.lastIndexOf(".");

    if (lastDotIndex === -1) {
        return "";
    }

    return fileName.slice(lastDotIndex).toLowerCase();
}