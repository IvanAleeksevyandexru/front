import { Meta } from '@storybook/angular/types-6-0';
import {moduleMetadata} from '@storybook/angular';
import {ActionButtonComponent} from '../../projects/epgu-constructor/src/app/shared/components/action-button/action-button.component';
import {ActionButtonModule} from '../../projects/epgu-constructor/src/app/shared/components/action-button/action-button.module';
import {PassportModule} from '../../projects/epgu-constructor/src/app/shared/components/add-passport/passport.module';
import {PassportComponent} from '../../projects/epgu-constructor/src/app/shared/components/add-passport/passport.component';
import {TextTransform} from '../../projects/epgu-constructor/src/app/shared/types/textTransform';
import {AnswerButtonComponent} from "../../projects/epgu-constructor/src/app/shared/components/answer-button/answer-button.component";
import {AnswerButtonModule} from "../../projects/epgu-constructor/src/app/shared/components/answer-button/answer-button.module";
import {EventBusService} from "../../projects/epgu-constructor/src/app/form-player/services/event-bus/event-bus.service";
import {ScreenService} from "../../projects/epgu-constructor/src/app/screen/screen.service";
import {CurrentAnswersService} from "../../projects/epgu-constructor/src/app/screen/current-answers.service";
import {CachedAnswersService} from "../../projects/epgu-constructor/src/app/shared/services/cached-answers/cached-answers.service";
import {UtilsService} from "../../projects/epgu-constructor/src/app/core/services/utils/utils.service";
import {ValueLoaderService} from "../../projects/epgu-constructor/src/app/shared/services/value-loader/value-loader.service";
import {SignatureApplicationComponent} from "../../projects/epgu-constructor/src/app/component/unique-screen/components/signature-application/components/signature-application/signature-application.component";
import {SignatureApplicationModule} from "../../projects/epgu-constructor/src/app/component/unique-screen/components/signature-application/signature-application.module";
import {
  ComponentDto,
  DTOActionAction
} from "../../projects/epgu-constructor/src/app/form-player/services/form-player-api/form-player-api.types";
import {NavigationService} from "../../projects/epgu-constructor/src/app/core/services/navigation/navigation.service";
import {DeviceDetectorService} from "../../projects/epgu-constructor/src/app/core/services/device-detector/device-detector.service";
import {ConfigService} from "../../projects/epgu-constructor/src/app/core/services/config/config.service";
import {LocationService} from "../../projects/epgu-constructor/src/app/core/services/location/location.service";
import {WINDOW_PROVIDERS} from "../../projects/epgu-constructor/src/app/core/providers/window.provider";
import {ModalService} from "../../projects/epgu-constructor/src/app/modal/modal.service";

export default {
  title: 'Example/EPGU Constructor',
  decorators: [
    moduleMetadata({
      imports: [
        ActionButtonModule,
        PassportModule,
        AnswerButtonModule,
        SignatureApplicationModule
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
        ModalService
      ],
    })
  ],
} as Meta;

export const ActionButton = (args: ActionButtonComponent) => ({
  template: '<epgu-constructor-action-button (click)="onClick($event)">{{content}}</epgu-constructor-action-button>',
  props: args,
});
ActionButton.args = {
  content: 'Button',
};
ActionButton.argTypes = {
  onClick: { action: 'clicked' }
};

export const Passport = (args: PassportComponent) => ({
  component: PassportComponent,
  props: args,
});
Passport.args = {
  attrs: {
    participant: {
      role: 'role1',
      mode: 'mode1'
    },
    fields: [],
    fstuc: TextTransform.ALL
  }
};

export const AnswerButton = (args: AnswerButtonComponent) => ({
  component: AnswerButtonComponent,
  props: args,
});
AnswerButton.args = {
  data: {},
  selectedValue: ''
};

const componentDtoSample: ComponentDto = {
  attrs: {
    image: {
      src: 'https://gu-st.ru/content/catalog/new/divorce_3_e-signature.svg',
      alt: ''
    }
  },
  id: 'id1',
  type: 'type1',
};

export const SignatureApplication = (args: SignatureApplicationComponent) => ({
  component: SignatureApplicationComponent,
  props: args
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
    }
  ]
};

