import { LOCALE_ID, NgModule } from '@angular/core';
import localeRu from '@angular/common/locales/ru';
import { registerLocaleData } from '@angular/common';
import { SmuEventsService } from '@epgu/epgu-lib';
import {
  CoreUiModule,
  MainContainerModule,
  PREV_BUTTON_NAVIGATION,
} from '@epgu/epgu-constructor-ui-kit';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { FormPlayerComponent } from './form-player.component';
import { FormPlayerApiService } from './services/form-player-api/form-player-api.service';
import { FormPlayerService } from './services/form-player/form-player.service';
import { CookieService } from 'ngx-cookie-service';
import { ScreenModule } from '../screen/screen.module';
import { CoreModule } from '../core/core.module';
import { ModalModule } from '../modal/modal.module';
import { BaseModule } from '../shared/base.module';
import { AutocompleteModule } from '../core/services/autocomplete/autocomplete.module';
import { LogicScreenModule } from '../component/logic-screen/logic-screen.module';

registerLocaleData(localeRu);

import 'hammerjs';
import { PrevButtonNavigationService } from '../core/services/prev-button-navigation/prev-button-navigation.service';
import { NotifierDisclaimerModule } from '../shared/components/disclaimer/notifier/notifier.module';

/**
 * Домен форм плеера. Здесь храняться всё что связано с форм плеером, его интеграцие с форм плеер апи.
 */
@NgModule({
  declarations: [FormPlayerComponent],
  imports: [
    ScreenModule,
    CoreModule,
    CoreUiModule,
    BaseModule,
    ModalModule,
    AutocompleteModule,
    LogicScreenModule,
    MainContainerModule,
    NotifierDisclaimerModule,
  ],
  providers: [
    FormPlayerService,
    FormPlayerApiService,
    CookieService,
    SmuEventsService,
    ConfigService,
    { provide: LOCALE_ID, useValue: 'ru' },
    {
      provide: PREV_BUTTON_NAVIGATION,
      useClass: PrevButtonNavigationService,
    },
  ],
  exports: [FormPlayerComponent],
  entryComponents: [FormPlayerComponent],
})
export class FormPlayerModule {}
