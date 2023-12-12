/* eslint-disable camelcase */
import createDebug from 'debug';
import { v2 as cloudinary } from 'cloudinary';
import { ImgData } from '../types/img.data';
import { HttpError } from '../types/http.error.js';

const debug = createDebug('ProjectFinal:mediaFiles');

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

    debug('Instantiated:MediaFiles');
    // Debug('Key', cloudinary.config().api_key);
  }

  async uploadImage(imgPath: string) {
    try {
      const uploadApiResponse = await cloudinary.uploader.upload(imgPath, {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });

      const imgData: ImgData = {
        url: uploadApiResponse.url,
        publicId: uploadApiResponse.public_id,
        size: uploadApiResponse.bytes,
        height: uploadApiResponse.height,
        width: uploadApiResponse.width,
        format: uploadApiResponse.format,
      };

      return imgData;
    } catch (err) {
      const error = (err as { error: Error }).error as Error;
      throw new HttpError(406, 'Not Acceptable', error.message);
    }
  }
}
