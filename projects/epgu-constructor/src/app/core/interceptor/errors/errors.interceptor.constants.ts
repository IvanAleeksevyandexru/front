import { ConfirmationModal } from '../../../modal/confirmation-modal/confirmation-modal.interface';

const COMMON_ERROR_MODAL_PARAMS_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Не сработало</h4>
<span>Попробуйте снова или зайдите позже. Если ничего не изменится — напишите в
<a target="_blank" href="https://www.gosuslugi.ru/feedback">службу поддержки</a>.</span></div>`;

const AUTH_ERROR_MODAL_PARAMS_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Войдите, чтобы продолжить</h4>
<span>Войдите с паролем, чтобы получить услугу. У вас должна быть
<a target="_blank" href="https://www.gosuslugi.ru/help/faq/c-1/1">подтвержденная учетная запись</a>.</span></div>`;

const ORDER_NOT_FOUND_ERROR_PARAMS_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Запрашиваемого черновика не существует</h4>
<span>Попробуйте снова или зайдите позже. Если ничего не изменится — напишите в
<a target="_blank" href="https://www.gosuslugi.ru/feedback">службу поддержки</a>.</span></div>`;

const DRAFT_STATEMENT_NOT_FOUND_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Черновик заявления не найден</h4>
<span>Проверьте в личном кабинете или создайте заявление заново.</span></div>`;

const BOOKING_ONLINE_ERROR_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>В подразделение нельзя записаться онлайн</h4>
<span>Для получения справки приходите на приём без записи по адресу: <br>
{addressLink} <br>
Вы можете посмотреть дополнительную информацию на устройстве или <br> в браузере — нажмите «Скачать PDF» в личном кабинете</span></div>`;

const TIME_INVITATION_ERROR_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/stop.svg">
<h4>Пока нельзя отправить</h4>
<span>Вы уже выслали приглашение. Подождите, оправить письмо повторно можно через 5 минут.</span></div>`;

export const COMMON_ERROR_MODAL_PARAMS: ConfirmationModal = {
  text: COMMON_ERROR_MODAL_PARAMS_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: true,
  buttons: [{
    label: 'Вернуться к заявлению',
    closeModal: true,
  }],
  isShortModal: true,
};


export const AUTH_ERROR_MODAL_PARAMS: ConfirmationModal = {
  text: AUTH_ERROR_MODAL_PARAMS_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: true,
  buttons: [{
    label: 'Войти',
    closeModal: true,
    value: 'login'
  }],
  isShortModal: true,
};

export const ORDER_NOT_FOUND_ERROR_MODAL_PARAMS: ConfirmationModal = {
  text: ORDER_NOT_FOUND_ERROR_PARAMS_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: true,
  buttons: [{
    label: 'Попробовать снова',
    closeModal: true,
    value: 'reload'
  }],
  isShortModal: true,
};

export const DRAFT_STATEMENT_NOT_FOUND: ConfirmationModal = {
  text: DRAFT_STATEMENT_NOT_FOUND_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: true,
  buttons: [{
    label: 'В личный кабинет',
    closeModal: true,
    value: 'redirectToLk'
  }],
  isShortModal: true,
};

export const BOOKING_ONLINE_ERROR: ConfirmationModal = {
  text: BOOKING_ONLINE_ERROR_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: true,
  buttons: [{
    label: 'В личный кабинет',
    closeModal: true,
    value: 'redirectToLk'
  }],
  isShortModal: true,
};

export const TIME_INVITATION_ERROR: ConfirmationModal = {
  text: TIME_INVITATION_ERROR_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: true,
  buttons: [{
    label: 'Вернуться к заявлению',
    closeModal: true,
  }],
  isShortModal: true,
};
