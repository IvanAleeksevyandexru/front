import { minSize } from '../../upload-and-edit-photo-form/upload-and-edit-photo-form.constant';

const aspectRatio = 1.144;

const showErrorTime = 7000;

const hintSetting = {
  title: 'Подсказка',
  text: 'Перетащите фото, чтобы изменить положение',
  color: '#FFD54C',
};
const minCropSize = {
  width: 306,
  height: 306 * (45 / 35),
  type: 'image/jpeg',
  output: {
    width: 413,
    height: 413 * (45 / 35),
  },
};
const photoMaskSrc = {
  desktop: 'assets/icons/svg/photo-mask-desktop.svg',
  phone: 'assets/icons/svg/photo-mask-mobile.svg',
};

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

const imageErrorText = {
  fileType: {
    title: 'Проверьте формат файла',
    text: 'Доступные для загрузки:',
    textRules: 'JPG, PNG.',
  },
  size: {
    title: 'Маленькое разрешение',
    text: 'Загрузите фото побольше. Например, от',
    textRules: `${minSize.width}x${minSize.height} px.`,
  },
  dpi: {
    title: 'Недостаточное разрешение (DPI)',
    text: 'Убедитесь, что у загружаемого фото минимум',
    textRules: '300 DPI.',
  },
  common: {
    title: 'Ошибка загрузки',
    text: 'Что-то пошло не так. Попробуйте загрузить файл ещё раз сейчас или выберите другой файл.',
    textRules: '',
  },
  fileName: {
    title: 'Ошибка имени файла',
    text: '',
    textRules: '',
  },
};

export {
  imageErrorText,
  minCropSize,
  aspectRatio,
  hintSetting,
  photoMaskSrc,
  showErrorTime,
  ImageErrorText,
  ImgSubject,
  NewSizeEvent,
};
