const COMMON_ERROR_MODAL_PARAMS_TEXT = `<div style="text-align: center">
<img style="display:block; margin: 56px auto 24px" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Не сработало</h4>
<span>Попробуйте снова или зайдите позже. Если ничего не изменится — напишите в
<a target="_blank" href="https://www.gosuslugi.ru/feedback">службу поддержки</a>.</span></div>`;

export const COMMON_ERROR_MODAL_PARAMS = {
  text: COMMON_ERROR_MODAL_PARAMS_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: true,
  buttons: [{
    label: 'Вернуться к заявлению',
    closeModal: true,
  }],
};

