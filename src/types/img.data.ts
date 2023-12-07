import createDebug from 'debug';

const debug = createDebug('ProjectFinal:ImgData');
debug('ImgDataInstantiated');
export type ImgData = {
  publicId: string;
  size: number;
  width: number;
  height: number;
  format: string;
  url: string;
};
