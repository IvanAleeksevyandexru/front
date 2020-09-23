const minCropSize = {
  width: 306,
  height: 350,
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
    textRules: `${minCropSize.width}x${minCropSize.height} px.`,
  },
  common: {
    title: 'Ошибка загрузки',
    text: 'Что-то пошло не так. Попробуйте загрузить файл ещё раз сейчас или выберите другой файл.',
    textRules: '',
  }
};

export { imageErrorText, minCropSize };


