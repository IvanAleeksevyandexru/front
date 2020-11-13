const minCropSize = {
  width: 306,
  height: 350,
};

const minSize = {
  width: 413,
  height: 531,
};

const imageErrorText = {
  fileType: {
    title: 'Проверьте формат файла',
    text: 'Доступные для загрузки:',
    textRules: 'JPG, PNG.'
  },
  size: {
    title: 'Маленькое разрешение',
    text: 'Загрузите фото побольше. Например, от',
    textRules: `${minSize.width}x${minSize.height} px.`,
  },
  common: {
    title: 'Ошибка загрузки',
    text: 'Что-то пошло не так. Попробуйте загрузить файл ещё раз сейчас или выберите другой файл.',
    textRules: '',
  }
};

enum uploadPhotoElemId {
  requirements = 'requirements',
  howToTakePhoto = 'howtotakephoto',
}

export { imageErrorText, minCropSize, uploadPhotoElemId, minSize };


