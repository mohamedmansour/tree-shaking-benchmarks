import path from 'node:path'
import fs from 'node:fs'

export function getFileSizeInBytes(path: string): number {
  const stats = fs.statSync(path)
  const fileSizeInBytes = stats.size
  return fileSizeInBytes
}

export function copyFolder(sourceFolder: string, destinationFolder: string, excludedExtensions: string[] = []): void {
  const files = fs.readdirSync(sourceFolder)
  for (const file of files) {
    const sourceFilePath = path.join(sourceFolder, file)
    const destinationFilePath = path.join(destinationFolder, file)
    const fileExtension = path.extname(file);
    if (fs.statSync(sourceFilePath).isDirectory()) {
      copyFolder(sourceFilePath, destinationFilePath, excludedExtensions)
    } else if (!excludedExtensions.includes(fileExtension)) {
      fs.mkdirSync(destinationFolder, { recursive: true })
      fs.copyFileSync(sourceFilePath, destinationFilePath);
    }
  }
}

export function symlinkDirRecursive(sourceDir: string, targetDir: string, excludedExtensions: string[] = []): void {
  fs.readdirSync(sourceDir).forEach((file) => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    const fileExtension = path.extname(file);
    if (fs.statSync(sourcePath).isDirectory()) {
      symlinkDirRecursive(sourcePath, targetPath, excludedExtensions);
    } else if (!excludedExtensions.includes(fileExtension)) {
      fs.mkdirSync(targetDir, { recursive: true })
      fs.linkSync(sourcePath, targetPath);
    }
  });
}

export function deleteFolderRecursive(path: string) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file) => {
      const curPath = `${path}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}