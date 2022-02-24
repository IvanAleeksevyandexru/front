import { ConfirmationModal } from '@epgu/epgu-constructor-types';

export const STATUS_ICON_MAP = {
  warning:
    '<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">',
  error:
    '<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/image-error.svg">',
  stop:
    '<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/stop.svg">',
};

export const COMMON_ERROR_MODAL_PARAMS_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Не сработало</h4>
<span>Попробуйте снова или зайдите позже. Если ничего не изменится — напишите в
<a target="_blank" href="https://www.gosuslugi.ru/feedback">службу поддержки</a></span></div>`;

const COMMON_ERROR_MODAL_PARAMS_TEXT_WITH_TRACEID = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Не сработало</h4>
<span>Попробуйте снова или зайдите позже. Если ничего не изменится — напишите в
<a target="_blank" href="https://www.gosuslugi.ru/feedback">службу поддержки</a> и передайте код ошибки:</span></div>`;

const REGIONS_MODAL_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Внимание!</h4>
<span>{textAsset}</span>
</div>`;

const MZRF_MODAL_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Внимание!</h4>
<span>{textAsset}</span>
</div>`;

const LOADING_ERROR_MODAL_PARAMS_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Ошибка загрузки</h4>
<span>{textAsset}</span></div>`;

const AUTH_ERROR_MODAL_PARAMS_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Войдите, чтобы продолжить</h4>
<span>Войдите с паролем, чтобы получить услугу. У вас должна быть
<a target="_blank" href="https://www.gosuslugi.ru/help/faq/c-1/1">подтвержденная учетная запись</a>.</span></div>`;

const ITEMS_REQUEST_TEXT_NO_DATA = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Внимание!</h4>
<span>{textAsset}</span></div>`;

const ITEMS_REQUEST_TEXT_FAILURE = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Ошибка бронирования</h4>
<span>{textAsset}</span></div>`;

const BOOKING_ONLINE_ERROR_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>В подразделение нельзя записаться онлайн</h4>
<span>Для получения справки приходите на приём без записи по адресу: <br>
{addressLink} <br>
Вы можете посмотреть дополнительную информацию на устройстве или <br> в браузере — нажмите «Скачать PDF» в личном кабинете</span></div>`;

const SERVICE_OR_SPEC_NO_SPECIALIST_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Нет доступных специалистов</h4>
<span>Выберите другую медицинскую организацию</span>
</div>`;

const SERVICE_OR_SPEC_NO_AVAILABLE_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Услуга временно недоступна в регионе</h4>
<span>Чтобы записаться к врачу, обновите страницу или вернитесь позже</span>
</div>`;

const SERVICE_OR_SPEC_SESSION_TIMEOUT_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Закончилось время</h4>
<span>Чтобы записаться к врачу, обновите страницу. Если ничего не изменится, начните заполнять форму заново</span>
</div>`;

const GET_SLOT_RESPONSE_TIMEOUT_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Закончилось время</h4>
<span>Чтобы записаться к врачу, обновите страницу. Если ничего не изменится, начните заполнять форму заново</span>
</div>`;

const STATIC_ERROR_MESSAGE_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Ошибка загрузки</h4>
<span>{textAsset}</span>
</div>`;

const INTERNAL_ERROR_MESSAGE_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>{titleAsset}</h4>
<span>{textAsset}</span>
</div>`;

const RESOURCE_NOT_AVAILABLE_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Ошибка услуга недоступна</h4>
<span>Чтобы записаться к врачу, обновите страницу или вернитесь позже</span>
</div>`;

const NO_DOCTORS_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Врачи не найдены</h4>
<span>По выбранной Вами медицинской должности в ближайшие 14 дней нет доступного времени для записи к специалистам через ЕПГУ. Пожалуйста, обратитесь в регистратуру медицинской организации</span>
</div>`;

const NO_DOCTORS_AVAILABLE_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Нет свободного времени для приёма</h4>
<span>{textAsset}</span>
</div>`;

const NO_MAP_ITEMS_AVAILABLE_TEXT = `<div class="text_modal_error">
<img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
<h4>Нет доступных подразделений</h4>
<span>Для подачи документов выберите подразделение в другом регионе</span>
</div>`;

export const RESOURCE_NOT_AVAILABLE: ConfirmationModal = {
  text: RESOURCE_NOT_AVAILABLE_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: true,
  buttons: [
    {
      label: 'Обновить',
      closeModal: true,
    },
  ],
  isShortModal: true,
};

export const NO_DOCTORS_AVAILABLE: ConfirmationModal = {
  text: NO_DOCTORS_AVAILABLE_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: true,
  buttons: [
    {
      label: 'Начать заново',
      color: 'white',
      closeModal: true,
      value: 'init',
    },
    {
      label: 'Попробовать ещё раз',
      closeModal: true,
    },
  ],
  isShortModal: true,
};

export const COMMON_ERROR_MODAL_PARAMS = (traceId?: string): ConfirmationModal => {
  return {
    text: traceId ? COMMON_ERROR_MODAL_PARAMS_TEXT_WITH_TRACEID : COMMON_ERROR_MODAL_PARAMS_TEXT,
    title: '',
    showCloseButton: false,
    showCrossButton: true,
    buttons: [
      {
        label: 'На предыдущий шаг',
        color: 'white',
        closeModal: true,
        value: 'prevStep',
      },
      {
        label: 'Попробовать ещё раз',
        closeModal: true,
      },
    ],
    isShortModal: true,
  };
};

export const REGIONS_MODAL: ConfirmationModal = {
  text: REGIONS_MODAL_TEXT,
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

export const MZRF_MODAL: ConfirmationModal = {
  text: MZRF_MODAL_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: true,
  buttons: [
    {
      label: 'На предыдущий шаг',
      color: 'white',
      closeModal: true,
      value: 'prevStep',
    },
    {
      label: 'Попробовать ещё раз',
      closeModal: true,
    },
  ],
  isShortModal: true,
};

export const NO_DOCTORS: ConfirmationModal = {
  text: NO_DOCTORS_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: true,
  buttons: [
    {
      label: 'Начать заново',
      color: 'white',
      closeModal: true,
      value: 'init',
    },
    {
      label: 'Попробовать ещё раз',
      value: 'prevStep',
      closeModal: true,
    },
  ],
  isShortModal: true,
};

export const LOADING_ERROR_MODAL_PARAMS: ConfirmationModal = {
  text: LOADING_ERROR_MODAL_PARAMS_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: true,
  buttons: [
    {
      label: 'Попробовать ещё раз',
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

export const NEW_BOOKING_ERROR: ConfirmationModal = {
  text: ITEMS_REQUEST_TEXT_NO_DATA,
  title: '',
  showCloseButton: false,
  showCrossButton: true,
  buttons: [
    {
      label: 'В личный кабинет',
      color: 'white',
      closeModal: true,
      value: 'redirectToLk',
    },
    {
      label: 'К заявлению',
      closeModal: true,
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
      label: 'На предыдущий шаг',
      color: 'white',
      closeModal: true,
      value: 'prevStep',
    },
    {
      label: 'Попробовать ещё раз',
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
      label: 'Попробовать ещё раз',
      closeModal: true,
    },
  ],
  isShortModal: true,
};

export const SESSION_TIMEOUT: ConfirmationModal = {
  text: ITEMS_REQUEST_TEXT_NO_DATA,
  title: '',
  showCloseButton: false,
  showCrossButton: false,
  buttons: [
    {
      label: 'В начало',
      closeModal: true,
      value: 'init',
    },
  ],
  isShortModal: true,
};

export const SERVICE_OR_SPEC_NO_SPECIALIST: ConfirmationModal = {
  text: SERVICE_OR_SPEC_NO_SPECIALIST_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: false,
  buttons: [
    {
      label: 'Обновить',
      closeModal: true,
      value: 'prevStep',
    },
  ],
  isShortModal: true,
};

export const SERVICE_OR_SPEC_NO_AVAILABLE: ConfirmationModal = {
  text: SERVICE_OR_SPEC_NO_AVAILABLE_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: false,
  buttons: [
    {
      label: 'Обновить',
      closeModal: true,
      value: 'prevStep',
    },
  ],
  isShortModal: true,
};

export const SERVICE_OR_SPEC_SESSION_TIMEOUT: ConfirmationModal = {
  text: SERVICE_OR_SPEC_SESSION_TIMEOUT_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: false,
  buttons: [
    {
      label: 'Начать заново',
      closeModal: true,
      value: 'init',
    },
  ],
  isShortModal: true,
};

export const SERVICE_OR_SPEC_SESSION_TIMEOUT_2: ConfirmationModal = {
  text: SERVICE_OR_SPEC_SESSION_TIMEOUT_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: false,
  buttons: [
    {
      label: 'Начать заново',
      closeModal: true,
      color: 'white',
      value: 'init',
    },
    {
      label: 'Обновить',
      closeModal: true,
    },
  ],
  isShortModal: true,
};

export const GET_SLOT_RESPONSE_TIMEOUT: ConfirmationModal = {
  text: GET_SLOT_RESPONSE_TIMEOUT_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: false,
  buttons: [
    {
      label: 'Начать заново',
      closeModal: true,
      color: 'white',
      value: 'init',
    },
    {
      label: 'Обновить',
      closeModal: true,
    },
  ],
  isShortModal: true,
};

export const STATIC_ERROR_MODAL: ConfirmationModal = {
  text: STATIC_ERROR_MESSAGE_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: false,
  buttons: [
    {
      label: 'Начать заново',
      closeModal: true,
      color: 'white',
      value: 'init',
    },
    {
      label: 'Попробовать ещё раз',
      value: 'prevStep',
      closeModal: true,
    },
  ],
  isShortModal: true,
};

export const INTERNAL_ERROR_MODAL: ConfirmationModal = {
  text: INTERNAL_ERROR_MESSAGE_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: false,
  buttons: [
    {
      label: 'Начать заново',
      closeModal: true,
      color: 'white',
      value: 'init',
    },
    {
      label: 'Попробовать ещё раз',
      value: 'prevStep',
      closeModal: true,
    },
  ],
  isShortModal: true,
};

export const NO_MAP_ITEMS_AVAILABLE: ConfirmationModal = {
  text: NO_MAP_ITEMS_AVAILABLE_TEXT,
  title: '',
  showCloseButton: false,
  showCrossButton: false,
  buttons: [
    {
      label: 'Изменить регион',
      closeModal: true,
      value: 'prevStep',
    },
  ],
  isShortModal: true,
};
