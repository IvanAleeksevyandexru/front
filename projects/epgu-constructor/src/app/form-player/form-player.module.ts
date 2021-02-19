import { NgModule } from '@angular/core';
import { SmuEventsService } from 'epgu-lib';
import { ConfigService } from '../core/services/config/config.service';
import { FormPlayerComponent } from './form-player.component';
import { FormPlayerApiService } from './services/form-player-api/form-player-api.service';
import { FormPlayerService } from './services/form-player/form-player.service';
import { FormPlayerConfigApiService } from './services/form-player-config-api/form-player-config-api.service';
import { CookieService } from 'ngx-cookie-service';
import { ScreenModule } from '../screen/screen.module';
import { CoreModule } from '../core/core.module';
import { ModalModule } from '../modal/modal.module';
import { BaseModule } from '../shared/base.module';
import { AutocompleteModule } from '../core/services/autocomplete/autocomplete.module';

import 'hammerjs'; // HAMMER TIME

/**
 * Домен форм плеера. Здесь храняться всё что связано с форм плеером, его интеграцие с форм плеер апи.
 */
@NgModule({
  declarations: [FormPlayerComponent],
  imports: [
    ScreenModule,
    CoreModule,
    BaseModule,
    ModalModule,
    AutocompleteModule
  ],
  providers: [
    FormPlayerConfigApiService,
    FormPlayerService,
    FormPlayerApiService,
    CookieService,
    SmuEventsService,
    ConfigService,
  ],
  exports: [FormPlayerComponent],
  entryComponents: [FormPlayerComponent],
})
export class FormPlayerModule {}
