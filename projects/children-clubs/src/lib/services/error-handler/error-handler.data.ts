import { ConfirmationModal } from '@epgu/epgu-constructor-types';

const AUTH_ERROR_MODAL_PARAMS_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Войдите, чтобы продолжить</h4>
<span>Войдите с паролем, чтобы получить услугу. У вас должна быть
<a target="_blank" href="https://www.gosuslugi.ru/help/faq/c-1/1">подтвержденная учетная запись</a>.</span></div>`;

const COMMON_ERROR_MODAL_PARAMS_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Не сработало</h4>
<span>Попробуйте снова или зайдите позже. Если ничего не изменится — напишите в
<a target="_blank" href="https://www.gosuslugi.ru/feedback">службу поддержки</a> и передайте код ошибки:</span></div>`;

export const AUTH_ERROR_MODAL_PARAMS: ConfirmationModal = {
  text: AUTH_ERROR_MODAL_PARAMS_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: true,
  buttons: [
    {
      label: 'Войти',
      closeModal: true,
      value: 'login',
    },
  ],
  isShortModal: true,
};

export const COMMON_ERROR_MODAL_PARAMS: ConfirmationModal = {
  text: COMMON_ERROR_MODAL_PARAMS_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: true,
  buttons: [
    {
      label: 'Вернуться к заявлению',
      closeModal: true,
    },
  ],
  isShortModal: true,
};
