const minCropSize = {
  width: 306,
  height: 306 * (45 / 35),
  type: 'image/jpeg',
  output: {
    width: 413,
    height: 413 * (45 / 35),
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
};

enum uploadPhotoElemId {
  requirements = 'requirements',
  howToTakePhoto = 'howtotakephoto',
}

export {
  imageErrorText,
  minCropSize,
  uploadPhotoElemId,
  minSize,
  mmInInch,
  printGuideInInch,
  recommendedDPI,
  printImgPx,
};
