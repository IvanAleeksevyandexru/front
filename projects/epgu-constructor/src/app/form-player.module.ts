import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { FormPlayerComponent } from './form-player.component';
import { ComponentScreenModule } from './screen/component-screen/component-screen.module';
import { CustomScreenModule } from './screen/custom-screen/custom-screen.module';
import { EmptyScreenModule } from './screen/empty-screen/empty-screen.module';
import { InfoScreenModule } from './screen/info-screen/info-screen.module';
import { InvitationErrorScreenModule } from './screen/invitation-error-screen/invitation-error-screen.module';
import { QuestionsScreenModule } from './screen/questions-screen/questions-screen.module';
import { ScreenService } from './screen/screen.service';
import { UniqueScreenModule } from './screen/unique-screen/unique-screen.module';
import { DictionaryApiService } from './services/api/dictionary-api/dictionary-api.service';
import { FormPlayerApiService } from './services/api/form-player-api/form-player-api.service';
import { ComponentStateService } from './services/component-state/component-state.service';
import { FormPlayerService } from './services/form-player/form-player.service';
import { UnsubscribeService } from './services/unsubscribe/unsubscribe.service';
import { SharedModule } from './shared/shared.module';
import { UtilsService } from './services/utils/utils.service';
import { ScreenResolverService } from './services/screen-resolver/screen-resolver.service';
import { ConfigService } from './config/config.service';

export const epguLibModule = EpguLibModule.forRoot();

@NgModule({
  declarations: [
    FormPlayerComponent,
  ],
  imports: [
    CommonModule,
    ComponentScreenModule,
    CustomScreenModule,
    EmptyScreenModule,
    QuestionsScreenModule,
    UniqueScreenModule,
    InvitationErrorScreenModule,
    SharedModule,
    epguLibModule,
    InfoScreenModule
  ],
  providers: [
    DictionaryApiService,
    FormPlayerService,
    FormPlayerApiService,
    ScreenService,
    ComponentStateService,
    UnsubscribeService,
    ScreenResolverService,
    UtilsService,
    ConfigService
  ],
  exports: [
    FormPlayerComponent
  ]
})
export class FormPlayerModule {
  static forRoot() {
    return {
      ngModule: FormPlayerModule,
    };
  }
}
