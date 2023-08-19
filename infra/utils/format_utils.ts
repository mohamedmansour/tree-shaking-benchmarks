export function formatFileSize(bytes: number): string {
    const fileSizeInKB = bytes / 1024
    return `${fileSizeInKB.toFixed(2)} KB`
}