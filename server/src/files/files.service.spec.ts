import { FilesService } from './files.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

jest.mock('fs');
jest.mock('uuid');

describe('FilesService', () => {
  let service: FilesService;

  beforeEach(() => {
    service = new FilesService();
  });

  const mockFile = (name: string, mimetype: string, buffer = Buffer.from('mock')) => ({
    originalname: name,
    mimetype,
    buffer,
  });

  describe('uploadFiles', () => {
    it('should save valid image files and return filenames', async () => {
      // Arrange
      const files = [
        mockFile('test1.png', 'image/png'),
        mockFile('test2.jpeg', 'image/jpeg'),
      ];
      const folder = 'heroes';

      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
      (uuid.v4 as jest.Mock).mockImplementation(() => 'uuid-mock');

      // Act
      const result = await service.uploadFiles(files, folder);

      // Assert
      expect(fs.mkdirSync).toHaveBeenCalledWith(
        path.resolve(__dirname, '..', 'static', folder),
        { recursive: true }
      );
      expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
      expect(result).toEqual([
        path.join(folder, 'uuid-mock.png'),
        path.join(folder, 'uuid-mock.jpeg'),
      ]);
    });

    it('should throw BAD_REQUEST for disallowed file types', async () => {
      const files = [mockFile('malware.exe', 'application/octet-stream')];

      await expect(service.uploadFiles(files, 'heroes')).rejects.toThrow(HttpException);
      await expect(service.uploadFiles(files, 'heroes')).rejects.toThrow(
        new HttpException(`Недозволений тип файлу: malware.exe`, HttpStatus.BAD_REQUEST)
      );
    });

    it('should throw INTERNAL_SERVER_ERROR if something fails', async () => {
      const files = [mockFile('test.png', 'image/png')];

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('fail');
      });

      await expect(service.uploadFiles(files, 'heroes')).rejects.toThrow(
        new HttpException('Помилка запису файлу', HttpStatus.INTERNAL_SERVER_ERROR)
      );
    });
  });
});