import { DisplayDto, ActionType, DTOActionAction, ScreenTypes } from '@epgu/epgu-constructor-types';

export const DOUBLE_ORDER_ERROR_DISPLAY: DisplayDto = {
  id: 'finishscreen_double_order_error',
  name: 'Финальная страница сценария электронный вариант',
  type: ScreenTypes.CUSTOM,
  header: '',
  components: [
    {
      id: 'finishcomponent_double_order_error',
      type: 'HtmlString',
      label:
        // eslint-disable-next-line max-len
        '<div class="text--center"><img src=\'{staticDomainAssetsPath}/assets/icons/svg/warn.svg\' /></div><h4 class="text--center">Жалоба на рассмотрении</h4><p class=\'text-color--text-helper text--center mt-16\'>Вы уже подали жалобу по данному постановлению. Дождитесь её рассмотрения, за статусом можно следить в личном кабинете</p>',
      attrs: {},
      value: '',
      required: true,
    },
  ],
  infoComponents: [],
  terminal: true,
  buttons: [
    {
      label: 'В личный кабинет',
      value: 'Перейти в личный кабинет',
      type: ActionType.redirectToLK,
      action: DTOActionAction.getNextStep,
    },
  ],
  firstScreen: false,
};
