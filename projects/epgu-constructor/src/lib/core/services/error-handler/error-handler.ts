import { ConfirmationModal } from '@epgu/epgu-constructor-types';

export const STATUS_ICON_MAP = {
  warning:
    '<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">',
  error:
    '<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/image-error.svg">',
};

const COMMON_ERROR_MODAL_PARAMS_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Не сработало</h4>
<span>Попробуйте снова или зайдите позже. Если ничего не изменится — напишите в
<a target="_blank" href="https://www.gosuslugi.ru/feedback">службу поддержки</a> и передайте код ошибки:</span></div>`;

const AUTH_ERROR_MODAL_PARAMS_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Войдите, чтобы продолжить</h4>
<span>Войдите с паролем, чтобы получить услугу. У вас должна быть
<a target="_blank" href="https://www.gosuslugi.ru/help/faq/c-1/1">подтвержденная учетная запись</a>.</span></div>`;

const ORDER_NOT_FOUND_ERROR_PARAMS_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Запрашиваемого черновика не существует</h4>
<span>Попробуйте снова или зайдите позже. Если ничего не изменится — напишите в
<a target="_blank" href="https://www.gosuslugi.ru/feedback">службу поддержки</a> и передайте код ошибки:</span></div>`;

const DRAFT_STATEMENT_NOT_FOUND_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Черновик заявления не найден</h4>
<span>Проверьте в личном кабинете или создайте заявление заново.</span></div>`;

const ITEMS_REQUEST_TEXT_NO_DATA = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Внимание!</h4>
<span>{textAsset}</span></div>`;

const ITEMS_REQUEST_TEXT_FAILURE = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="https://gu-st.ru/content/catalog/new/marriage_6_booking_deny.svg">
<h4>Внимание!</h4>
<span>{textAsset}</span></div>`;

const BOOKING_ONLINE_ERROR_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>В подразделение нельзя записаться онлайн</h4>
<span>Для получения справки приходите на приём без записи по адресу: <br>
{addressLink} <br>
Вы можете посмотреть дополнительную информацию на устройстве или <br> в браузере — нажмите «Скачать PDF» в личном кабинете</span></div>`;

const NO_RIGHTS_FOR_SENDING_APPLICATION_ERROR_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Отправить заявление может только руководитель</h4>
<span>Заявление сохранено как черновик и доступно в личном кабинете руководителя. Вы можете редактировать его, пока оно не отправлено</span>
</div>`;

const TIME_INVITATION_ERROR_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/stop.svg">
<h4>Пока нельзя отправить</h4>
<span>Вы уже выслали приглашение. Подождите, оправить письмо повторно можно через 5 минут.</span></div>`;

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

export const ORDER_NOT_FOUND_ERROR_MODAL_PARAMS: ConfirmationModal = {
  text: ORDER_NOT_FOUND_ERROR_PARAMS_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: true,
  buttons: [
    {
      label: 'Попробовать снова',
      closeModal: true,
      value: 'reload',
    },
  ],
  isShortModal: true,
};

export const DRAFT_STATEMENT_NOT_FOUND: ConfirmationModal = {
  text: DRAFT_STATEMENT_NOT_FOUND_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: true,
  buttons: [
    {
      label: 'В личный кабинет',
      closeModal: true,
      value: 'redirectToLk',
    },
  ],
  isShortModal: true,
};

export const BOOKING_ONLINE_ERROR: ConfirmationModal = {
  text: BOOKING_ONLINE_ERROR_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: true,
  buttons: [
    {
      label: 'В личный кабинет',
      closeModal: true,
      value: 'redirectToLk',
    },
  ],
  isShortModal: true,
};

export const ITEMS_NO_DATA: ConfirmationModal = {
  text: ITEMS_REQUEST_TEXT_NO_DATA,
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

export const ITEMS_FAILURE: ConfirmationModal = {
  text: ITEMS_REQUEST_TEXT_FAILURE,
  title: '',
  showCloseButton: false,
  showCrossButton: true,
  buttons: [
    {
      label: 'На главную',
      color: 'white',
      closeModal: true,
      value: 'redirectToLk',
    },
    {
      label: 'Вернуться к заявлению',
      closeModal: true,
    },
  ],
  isShortModal: true,
};

export const NO_RIGHTS_FOR_SENDING_APPLICATION_ERROR: ConfirmationModal = {
  text: NO_RIGHTS_FOR_SENDING_APPLICATION_ERROR_TEXT,
  title: '',
  showCloseButton: true,
  showCrossButton: true,
  buttons: [],
  isShortModal: true,
};

export const TIME_INVITATION_ERROR: ConfirmationModal = {
  text: TIME_INVITATION_ERROR_TEXT,
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