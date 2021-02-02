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

export { ImageErrorText, ImgSubject, NewSizeEvent };
