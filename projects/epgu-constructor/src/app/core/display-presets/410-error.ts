import { ScreenTypes } from '../../screen/screen.types';
import { DisplayDto } from 'epgu-constructor-types/dist/base/screen';
import { ActionType, DTOActionAction } from 'epgu-constructor-types/dist/base/component-action-dto';

const EXPIRE_ORDER_ERROR_DISPLAY: DisplayDto = {
  id: 'finishscreen_expire_order_error',
  name: 'Финальная страница сценария электронный вариант',
  type: ScreenTypes.CUSTOM,
  header: '',
  submitLabel: '',
  components: [
    {
      id: 'finishcomponent_expire_order_error',
      type: 'HtmlString',
      // eslint-disable-next-line max-len
      label: '<div class=\"text--center\"><img src=\'{staticDomainAssetsPath}/assets/icons/svg/warn.svg\' /></div><h4 class=\"text--center\">Ссылка устарела</h4><p class=\'text-color--text-helper text--center mt-16\'>Когда-то эта ссылка принесла пользу, но теперь не работает</p>',
      attrs: {},
      value: '',
      required: true
    }
  ],
  infoComponents: [],
  terminal: true,
  buttons: [
    {
      label: 'На главную',
      value: 'На главную',
      type: ActionType.home,
      action: DTOActionAction.getNextStep
    }
  ],
  firstScreen: false
};

export default EXPIRE_ORDER_ERROR_DISPLAY;
