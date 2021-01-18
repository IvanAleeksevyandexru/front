import { moduleMetadata } from '@storybook/angular';
import { Meta } from '@storybook/angular/types-6-0';
import { AnimationBuilder } from '@angular/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AddPassportModule } from '../../projects/epgu-constructor/src/app/component/component-screen/components/add-passport/add-passport.module';
import { AddPassportComponent } from '../../projects/epgu-constructor/src/app/component/component-screen/components/add-passport/component/add-passport.component';
import { DateRangeService } from '../../projects/epgu-constructor/src/app/component/components-list/services/date-range/date-range.service';
import { SignatureApplicationComponent } from '../../projects/epgu-constructor/src/app/component/unique-screen/components/signature-application/components/signature-application/signature-application.component';
import { SignatureApplicationModule } from '../../projects/epgu-constructor/src/app/component/unique-screen/components/signature-application/signature-application.module';
import { UnusedPaymentsComponent } from '../../projects/epgu-constructor/src/app/component/unique-screen/components/unused-payments/component/unused-payments.component';
import { UnusedPaymentInterface } from '../../projects/epgu-constructor/src/app/component/unique-screen/components/unused-payments/unused-payment.interface';
import { UnusedPaymentsModule } from '../../projects/epgu-constructor/src/app/component/unique-screen/components/unused-payments/unused-payments.module';
import { WINDOW_PROVIDERS } from '../../projects/epgu-constructor/src/app/core/providers/window.provider';
import { ConfigService } from '../../projects/epgu-constructor/src/app/core/services/config/config.service';
import { DeviceDetectorService } from '../../projects/epgu-constructor/src/app/core/services/device-detector/device-detector.service';
import { EventBusService } from '../../projects/epgu-constructor/src/app/core/services/event-bus/event-bus.service';
import { LocationService } from '../../projects/epgu-constructor/src/app/core/services/location/location.service';
import { NavigationService } from '../../projects/epgu-constructor/src/app/core/services/navigation/navigation.service';
import { UtilsService } from '../../projects/epgu-constructor/src/app/core/services/utils/utils.service';
import {
  ComponentDto,
  DisplayDto,
  DTOActionAction,
} from '../../projects/epgu-constructor/src/app/form-player/services/form-player-api/form-player-api.types';
import { ModalService } from '../../projects/epgu-constructor/src/app/modal/modal.service';
import { CurrentAnswersService } from '../../projects/epgu-constructor/src/app/screen/current-answers.service';
import { ScreenService } from '../../projects/epgu-constructor/src/app/screen/screen.service';
import { ScreenTypes } from '../../projects/epgu-constructor/src/app/screen/screen.types';
import { ActionButtonComponent } from '../../projects/epgu-constructor/src/app/shared/components/action-button/action-button.component';
import { ActionButtonModule } from '../../projects/epgu-constructor/src/app/shared/components/action-button/action-button.module';
import { PassportComponent } from '../../projects/epgu-constructor/src/app/shared/components/add-passport/passport.component';
import { PassportModule } from '../../projects/epgu-constructor/src/app/shared/components/add-passport/passport.module';
import { AnswerButtonComponent } from '../../projects/epgu-constructor/src/app/shared/components/answer-button/answer-button.component';
import { AnswerButtonModule } from '../../projects/epgu-constructor/src/app/shared/components/answer-button/answer-button.module';
import { CachedAnswersService } from '../../projects/epgu-constructor/src/app/shared/services/cached-answers/cached-answers.service';
import { ValidationService } from '../../projects/epgu-constructor/src/app/shared/services/validation/validation.service';
import { ValueLoaderService } from '../../projects/epgu-constructor/src/app/shared/services/value-loader/value-loader.service';
import { TextTransform } from '../../projects/epgu-constructor/src/app/shared/types/textTransform';
import { CarInfoModule } from '../../projects/epgu-constructor/src/app/component/unique-screen/components/car-info/car-info.module';
import { CarInfoComponent } from '../../projects/epgu-constructor/src/app/component/unique-screen/components/car-info/components/car-info-screen/car-info.component';
import { FormPlayerApiService } from '../../projects/epgu-constructor/src/app/form-player/services/form-player-api/form-player-api.service';
import { InitDataService } from '../../projects/epgu-constructor/src/app/core/services/init-data/init-data.service';
import { LoggerService } from '../../projects/epgu-constructor/src/app/core/services/logger/logger.service';
import { NavigationModalService } from '../../projects/epgu-constructor/src/app/core/services/navigation-modal/navigation-modal.service';
import { LocalStorageService } from '../../projects/epgu-constructor/src/app/core/services/local-storage/local-storage.service';
import { HtmlRemoverService } from '../../projects/epgu-constructor/src/app/shared/services/html-remover/html-remover.service';
import { SelectChildrenScreenModule } from '../../projects/epgu-constructor/src/app/component/component-screen/components/select-children/select-children-screen.module';
import { SelectChildrenComponent } from '../../projects/epgu-constructor/src/app/component/component-screen/components/select-children/components/select-children/select-children.component';

export default {
  title: 'Example/EPGU Constructor',
  decorators: [
    moduleMetadata({
      imports: [
        ActionButtonModule,
        PassportModule,
        AnswerButtonModule,
        SignatureApplicationModule,
        UnusedPaymentsModule,
        AddPassportModule,
        CarInfoModule,
        SelectChildrenScreenModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      schemas: [],
      declarations: [],
      providers: [
        EventBusService,
        ScreenService,
        CachedAnswersService,
        CurrentAnswersService,
        UtilsService,
        ValueLoaderService,
        NavigationService,
        DeviceDetectorService,
        ConfigService,
        LocationService,
        WINDOW_PROVIDERS,
        ModalService,
        ValidationService,
        DateRangeService,
        FormPlayerApiService,
        InitDataService,
        LoggerService,
        NavigationModalService,
        LocalStorageService,
        HtmlRemoverService,
        AnimationBuilder,
      ],
    }),
  ],
} as Meta;

export const ActionButton = (args: ActionButtonComponent) => ({
  template:
    '<epgu-constructor-action-button (click)="onClick($event)">{{content}}</epgu-constructor-action-button>',
  props: args,
});
ActionButton.args = {
  content: 'Button',
};
ActionButton.argTypes = {
  onClick: { action: 'clicked' },
};

export const Passport = (args: PassportComponent) => ({
  component: PassportComponent,
  props: args,
});
Passport.args = {
  attrs: {
    participant: {
      role: 'role1',
      mode: 'mode1',
    },
    fields: [],
    fstuc: TextTransform.ALL,
  },
};

export const AnswerButton = (args: AnswerButtonComponent) => ({
  component: AnswerButtonComponent,
  props: args,
});
AnswerButton.args = {
  data: {},
  selectedValue: '',
};

const componentDtoSample: ComponentDto = {
  attrs: {
    image: {
      src: 'https://gu-st.ru/content/catalog/new/divorce_3_e-signature.svg',
      alt: '',
    },
  },
  id: 'id1',
  type: 'type1',
};

export const SignatureApplication = (args: SignatureApplicationComponent) => ({
  component: SignatureApplicationComponent,
  props: args,
});
SignatureApplication.args = {
  isMobile: false,
  showNav: true,
  header: 'Some header',
  component: componentDtoSample,
  isLoading: false,
  actions: [
    {
      label: 'label1',
      value: 'value1',
      color: 'white',
      action: DTOActionAction.editEmail,
    },
  ],
};

const DisplayDtoSample: DisplayDto = {
  components: [],
  header: '',
  id: '',
  terminal: false,
  type: ScreenTypes.COMPONENT,
  name: 'name',
  submitLabel: 'submitLabel',
};
const paymentsDataSample: UnusedPaymentInterface[] = [
  { uin: '123', payDate: 123123123, amount: 123, link: 'http://link' },
];

export const UnusedPayments = (args: UnusedPaymentsComponent) => ({
  component: UnusedPaymentsComponent,
  props: args,
});

UnusedPayments.args = {
  showNav: true,
  data: DisplayDtoSample,
  paymentsData: paymentsDataSample,
};

export const AddPassport = (args: AddPassportComponent) => ({
  component: AddPassportComponent,
  props: args,
});
AddPassport.args = {
  data: {
    participant: { role: 'Approval', mode: 'MentionedApplicant' },
    fstuc: TextTransform.ALL,
    fields: [
      {
        mask: ['/[0-9]/', '/[0-9]/', '/[0-9]/', '/[0-9]/'],
        fieldName: 'rfPasportSeries',
        label: 'Серия',
        type: 'input',
        regexp: '^[0-9]{4}$',
        errorMsg: 'Поле должно содержать 4 цифры',
      },
      {
        mask: ['/[0-9]/', '/[0-9]/', '/[0-9]/', '/[0-9]/', '/[0-9]/', '/[0-9]/'],
        fieldName: 'rfPasportNumber',
        label: 'Номер',
        type: 'input',
        regexp: '^[0-9]{6}$',
        errorMsg: 'Поле должно содержать 6 цифр',
      },
    ],
  },
};

export const CarInfo = (args: CarInfoComponent) => ({
  component: CarInfoComponent,
  props: args,
});
CarInfo.args = {
  carInfo: {
    brandModel: 'test',
    status: 'REGISTERED',
    owners: [],
    legals: [],
    accidenceCount: 3,
  },
};

export const SelectChildren = (args: SelectChildrenComponent) => ({
  component: SelectChildrenComponent,
  props: args,
});
SelectChildren.args = {
  addSectionLabel: 'Далее',
  cachedValue: null,
  errors: {},
  component: {
    id: 'ai18',
    type: 'ChildrenListUnder14',
    label: '',
    attrs: {
      imaginaryOidBase: 10,
      isCycled: true,
      components: [
        {
          id: 'ai18_0',
          type: 'StringInput',
          label: 'Идентификатор',
          attrs: {
            hidden: true,
            fields: [{ fieldName: 'id' }],
            validation: [
              {
                type: 'RegExp',
                value: '.+',
                ref: '',
                dataType: '',
                condition: '',
                errorMsg: 'Поле не может быть пустым',
              },
            ],
            hint: 'Дату регистрации можно найти на штампе о регистрации на стр. 5-12 паспорта РФ',
          },
          value: '',
          required: true,
        },
        {
          id: 'ai18_00',
          type: 'LabelSection',
          label: "<p class='text-color--text-helper'>Укажите детей до 14 лет</p>",
          attrs: {},
          value: '',
          required: true,
        },
        {
          id: 'ai18_1',
          type: 'DateInput',
          label: 'Дата рождения',
          attrs: {
            grid: 'grid-col-6 grid-col-12-sm',
            fields: [{ fieldName: 'birthDate' }],
            accuracy: 'day',
            minDate: '-14y',
            maxDate: 'today',
            validation: [
              {
                type: 'RegExp',
                value: '.*',
                ref: '',
                condition: '',
                errorMsg: 'Поле должно быть заполено',
              },
            ],
          },
          value: '',
          required: true,
        },
        {
          id: 'ai18_2',
          type: 'RadioInput',
          label: 'Пол',
          attrs: {
            fields: [{ fieldName: 'gender' }],
            supportedValues: [
              { label: 'Мальчик', value: 'M', isDefault: true },
              { label: 'Девочка', value: 'F' },
            ],
            isHorizontal: true,
            required: true,
          },
          value: '',
          required: true,
        },
        {
          id: 'ai18_3',
          type: 'StringInput',
          label: 'Фамилия',
          attrs: {
            fstuc: 'first',
            fields: [{ fieldName: 'lastName' }],
            validation: [
              {
                type: 'RegExp',
                value: '.+',
                ref: '',
                dataType: '',
                condition: '',
                errorMsg: 'Поле не может быть пустым',
              },
              {
                type: 'RegExp',
                value: '^.{0,30}$',
                ref: '',
                dataType: '',
                condition: '',
                errorMsg: 'Поле может содержать не более 30 символов',
              },
            ],
          },
          value: '',
          required: true,
        },
        {
          id: 'ai18_4',
          type: 'StringInput',
          label: 'Имя',
          attrs: {
            fstuc: 'first',
            fields: [{ fieldName: 'firstName' }],
            validation: [
              {
                type: 'RegExp',
                value: '.+',
                ref: '',
                dataType: '',
                condition: '',
                errorMsg: 'Поле не может быть пустым',
              },
              {
                type: 'RegExp',
                value: '^.{0,30}$',
                ref: '',
                dataType: '',
                condition: '',
                errorMsg: 'Поле может содержать не более 30 символов',
              },
            ],
          },
          value: '',
          required: true,
        },
        {
          id: 'ai18_5',
          type: 'StringInput',
          label: 'Отчество',
          attrs: {
            fstuc: 'first',
            fields: [{ fieldName: 'middleName' }],
            validation: [
              {
                type: 'RegExp',
                value: '^.{0,30}$',
                ref: '',
                dataType: '',
                condition: '',
                errorMsg: 'Поле может содержать не более 30 символов',
              },
            ],
            customUnrecLabel: 'При наличии',
          },
          value: '',
          required: false,
        },
        {
          id: 'ai18_6',
          type: 'RadioInput',
          label: 'Ребенок новый?',
          attrs: {
            hidden: true,
            fields: [{ fieldName: 'isNew' }],
            supportedValues: [
              { label: 'Да', value: true },
              { label: 'Нет', value: false, isDefault: false },
            ],
            isHorizontal: true,
          },
          value: '',
          required: true,
        },
      ],
      refs: {},
      maxAge: 13,
    },
    linkedValues: [],
    arguments: {},
    value:
      '[{"ai18_4":"Dsssss","ai18_6":false,"ai18_0":"7588631","ai18_1":"2020-01-14T00:00:00Z","ai18_2":"F","ai18_3":"Впрол"}]',
    required: true,
  },
};
