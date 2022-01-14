const cropperConfig = {
  face: {
    width: 306,
    height: 306 * (45 / 35),
    type: 'image/jpeg',
    output: {
      width: 413,
      height: 413 * (45 / 35),
    },
    containerSize: {
      width: 306,
      height: 306 * (45 / 35),
    },
  },
  '1:1': {
    width: 220,
    height: 220,
    type: 'image/jpeg',
    output: {
      width: 220,
      height: 220,
    },
    containerSize: {
      width: 306,
      height: 306,
    },
  },
  '3:4': {
    width: 220,
    height: 308,
    type: 'image/jpeg',
    output: {
      width: 220,
      height: 308,
    },
    containerSize: {
      width: 306,
      height: 393,
    },
  },
};

const minSize = {
  width: 413,
  height: 531,
};

const mmInInch = 25.4;
const recommendedDPI = 300;
const printGuideInInch = {
  width: 35 / mmInInch,
  height: 45 / mmInInch,
}; /* рамка в дюймах, переведнная из мм (размер для печати) */
// Вычисляем рекомендуемые размеры изображения в пикселях при рекомендованном DPI
const printImgPx = {
  width: printGuideInInch.width * recommendedDPI,
  height: printGuideInInch.height * recommendedDPI,
};

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

enum UploadPhotoElemId {
  requirements = 'requirements',
  howToTakePhoto = 'howtotakephoto',
  whyneedphoto = 'whyneedphoto',
}

export {
  cropperConfig,
  imageErrorText,
  UploadPhotoElemId,
  minSize,
  mmInInch,
  printGuideInInch,
  recommendedDPI,
  printImgPx,
};
