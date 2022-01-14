import { ImgCropperConfig } from '@alyle/ui/image-cropper';

interface ImageErrorText {
  [errorType: string]: {
    title: string;
    text: string;
    textRules: string;
  };
}

interface ImgSubject {
  imageObjectUrl: string;
  imageErrors?: string[][];
}

interface NewSizeEvent {
  newWidth: number;
  newHeight: number;
  oldWidth: number;
  oldHeight: number;
}

interface ExtendedImgCropperConfig extends ImgCropperConfig {
  containerSize?: {
    width: number;
    height: number;
  };
}

export { ImageErrorText, ImgSubject, NewSizeEvent, ExtendedImgCropperConfig };
