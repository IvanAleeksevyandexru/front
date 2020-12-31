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

export default {
  title: 'Example/EPGU Constructor',
  decorators: [
    moduleMetadata({
      imports: [
        ActionButtonModule,
        PassportModule,
        AnswerButtonModule,
      ],
      schemas: [],
      declarations: [],
      providers: [
        EventBusService,
        ScreenService,
        CachedAnswersService,
        CurrentAnswersService,
        UtilsService,
        ValueLoaderService
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
  attrs: {
    data: {},
    selectedValue: ''
  }
};

