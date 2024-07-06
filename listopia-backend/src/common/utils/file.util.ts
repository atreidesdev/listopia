import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

interface SaveFileOptions {
  file: Express.Multer.File;
  filename: string;
  folder: string;
}

@Injectable()
export class FileUtil {
  private readonly baseFolder = path.join(__dirname, '..', '..', 'uploads');
  private readonly placeholderFilename = 'placeholder.png';

  constructor() {
    this.ensureBaseFolderExists();
  }

  private ensureBaseFolderExists() {
    if (!fs.existsSync(this.baseFolder)) {
      fs.mkdirSync(this.baseFolder, { recursive: true });
    }
  }

  public async saveFile({
    file,
    filename,
    folder,
  }: SaveFileOptions): Promise<string> {
    const folderPath = path.join(this.baseFolder, folder);
    this.ensureFolderExists(folderPath);

    const filePath = path.join(folderPath, filename);
    await fs.promises.writeFile(filePath, file.buffer);

    return path.relative(this.baseFolder, filePath);
  }

  private ensureFolderExists(folderPath: string) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  }

  public async deleteFile(filePath: string): Promise<void> {
    const absolutePath = path.join(this.baseFolder, filePath);

    if (path.basename(absolutePath) === this.placeholderFilename) {
      return;
    }

    if (fs.existsSync(absolutePath)) {
      await fs.promises.unlink(absolutePath);
    }
  }

  public async updateFile(
    newFile: Express.Multer.File,
    oldFilePath: string,
    newFilename: string,
    folder: string,
  ): Promise<string> {
    await this.deleteFile(oldFilePath);

    return this.saveFile({
      file: newFile,
      filename: newFilename,
      folder: folder,
    });
  }
}