import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path'
import * as fs from 'fs'
import * as uuid from 'uuid'

@Injectable()
export class FilesService {
    async uploadFiles(files: any, folder: string): Promise<string[]> {
        const allowedMimeTypes = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp']);
        const allowedExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp']);

        for (const file of files) {
            const ext = path.extname(file.originalname).toLowerCase();

            if (!allowedExtensions.has(ext) || !allowedMimeTypes.has(file.mimetype)) {
                throw new HttpException(
                    `Недозволений тип файлу: ${file.originalname}`,
                    HttpStatus.BAD_REQUEST
                );
            }
        }

        try {
            const basePath = path.resolve(__dirname, '..', 'static', folder);

            if (!fs.existsSync(basePath)) {
                fs.mkdirSync(basePath, { recursive: true });
            }

            const fileNames: string[] = [];

            for (const file of files) {
                const ext = path.extname(file.originalname);
                const fileName = uuid.v4() + ext;
                const filePath = path.join(basePath, fileName);

                fs.writeFileSync(filePath, file.buffer);
                fileNames.push(path.join(folder, fileName));
            }

            return fileNames;
        } catch (e) {
            throw new HttpException('Помилка запису файлу', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}