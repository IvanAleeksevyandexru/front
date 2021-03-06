import { LOCALE_ID, NgModule } from '@angular/core';
import localeRu from '@angular/common/locales/ru';
import { registerLocaleData } from '@angular/common';
import {
  CoreUiModule,
  MainContainerModule,
  PREV_BUTTON_NAVIGATION,
  ConfigService,
  ModalService,
  LocationService,
} from '@epgu/epgu-constructor-ui-kit';
import { CookieService } from 'ngx-cookie-service';
import { SmuEventsService } from '@epgu/ui/services/smu-events';
import { NotifierModule } from '@epgu/ui/components/notifier';
import { FormPlayerComponent } from './form-player.component';
import { FormPlayerApiService } from './services/form-player-api/form-player-api.service';
import { FormPlayerService } from './services/form-player/form-player.service';
import { ScreenModule } from '../screen/screen.module';
import { CoreModule } from '../core/core.module';
import { ModalModule } from '../modal/modal.module';
import { BaseModule } from '../shared/base.module';
import { AutocompleteModule } from '../core/services/autocomplete/autocomplete.module';
import { LogicScreenModule } from '../component/logic-screen/logic-screen.module';
import { PrevButtonNavigationService } from '../core/services/prev-button-navigation/prev-button-navigation.service';
import { NotifierDisclaimerModule } from '../shared/components/disclaimer/notifier/notifier.module';
import '@squadette/hammerjs';
import { NavigationService } from '../core/services/navigation/navigation.service';

registerLocaleData(localeRu);

/**
 * Домен форм плеера. Здесь храняться всё что связано с форм плеером, его интеграцие с форм плеер апи.
 */
@NgModule({
  declarations: [FormPlayerComponent],
  imports: [
    AutocompleteModule,
    BaseModule,
    CoreModule,
    CoreUiModule,
    LogicScreenModule,
    MainContainerModule,
    ModalModule,
    NotifierDisclaimerModule,
    NotifierModule,
    ScreenModule,
  ],
  providers: [
    ConfigService,
    CookieService,
    FormPlayerApiService,
    FormPlayerService,
    LocationService,
    ModalService,
    NavigationService,
    SmuEventsService,
    { provide: LOCALE_ID, useValue: 'ru' },
    {
      provide: PREV_BUTTON_NAVIGATION,
      useClass: PrevButtonNavigationService,
    },
  ],
  exports: [FormPlayerComponent],
})
export class FormPlayerModule {}
