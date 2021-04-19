import { ScreenTypes } from '../../screen/screen.types';
import { DisplayDto } from 'epgu-constructor-types/dist/base/screen';
import { ActionType, DTOActionAction } from 'epgu-constructor-types/dist/base/component-action-dto';

export const DOUBLE_ORDER_ERROR_DISPLAY: DisplayDto = {
  id: 'finishscreen_double_order_error',
  name: 'Финальная страница сценария электронный вариант',
  type: ScreenTypes.CUSTOM,
  header: '',
  submitLabel: '',
  components: [
    {
      id: 'finishcomponent_double_order_error',
      type: 'HtmlString',
      // eslint-disable-next-line max-len
      label: '<div class=\"text--center\"><img src=\'{staticDomainAssetsPath}/assets/icons/svg/warn.svg\' /></div><h4 class=\"text--center\">Подать заявление пока нельзя</h4><p class=\'text-color--text-helper text--center mt-16\'>У вас уже есть поданное заявление по этой услуге. Чтобы <br>получить новое — дождитесь результатов обработки текущего.</p>',
      attrs: {},
      value: '',
      required: true
    }
  ],
  infoComponents: [],
  terminal: true,
  buttons: [
    {
      label: 'В личный кабинет',
      value: 'Перейти в личный кабинет',
      type: ActionType.redirectToLK,
      action: DTOActionAction.getNextStep
    }
  ],
  firstScreen: false
};

export default DOUBLE_ORDER_ERROR_DISPLAY;
