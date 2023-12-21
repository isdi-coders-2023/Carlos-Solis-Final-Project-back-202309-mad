/* eslint-disable camelcase */
import { v2 as cloudinary } from 'cloudinary';
import createDebug from 'debug';
import { ImgData } from '../types/img.data';
import { HttpError } from '../types/http.error.js';

const debug = createDebug('ProjectFinal:media:files');

export class MediaFiles {
  constructor() {
    cloudinary.config({
      cloud_name: 'dr9thefkq',
      api_key: '366833462978475',
      api_secret: 'FX45i8ewBkM_wwRHHbLW7mgcWjk',
    });

    cloudinary.config({
      secure: true,
    });

    debug('instanciated');
  }

  async uploadImage(imagePath: string) {
    try {
      const uploadApiResponse = await cloudinary.uploader.upload(imagePath, {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });
      console.log('desde upload', uploadApiResponse);

      const imgData: ImgData = {
        url: uploadApiResponse.url,
        publicId: uploadApiResponse.publicId,
        size: uploadApiResponse.size,
        height: uploadApiResponse.height,
        width: uploadApiResponse.width,
        format: uploadApiResponse.format,
      };
      console.log('desde MediaFiles', imgData);
      return imgData;
    } catch (err) {
      const error = (err as { error: Error }).error as Error;
      throw new HttpError(406, 'Not acceptable', error.message);
    }
  }
}
