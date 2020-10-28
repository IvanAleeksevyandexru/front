import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { InvitationErrorScreenModule } from './invitation-error-screen/invitation-error-screen.module';
import { UniqueScreenModule } from './unique-screen/unique-screen.module';
import { QuestionsScreenModule } from './questions-screen/questions-screen.module';
import { EmptyScreenModule } from './empty-screen/empty-screen.module';
import { CustomScreenModule } from './custom-screen/custom-screen.module';
import { ComponentScreenModule } from './component-screen/component-screen.module';
import { SharedModule } from '../shared/shared.module';
import { InfoScreenModule } from './info-screen/info-screen.module';
import { InfoScreenComponent } from './info-screen/info-screen.component';
import { QuestionsScreenComponent } from './questions-screen/questions-screen.component';
import { ComponentScreenComponent } from './component-screen/component-screen.component';
import { EmptyScreenComponent } from './empty-screen/empty-screen.component';
import { UniqueScreenComponent } from './unique-screen/unique-screen.component';
import { CustomScreenComponent } from './custom-screen/custom-screen.component';
import { InvitationErrorScreenComponent } from './invitation-error-screen/invitation-error-screen.component';
import { ScreenResolverComponent } from './screen-resolver/screen-resolver.component';
import { DictionaryApiService } from './services/dictionary-api/dictionary-api.service';
import { CurrentAnswersService } from './current-answers.service';
import { ScreenService } from './screen.service';
import { ToolsService } from './services/tools/tools.service';
import { CycledFieldsService } from './services/cycled-fields/cycled-fields.service';


const EpguLibModuleInited = EpguLibModule.forRoot();

/**
 * Домен скринов. Сдесь храниться всё что связанно со скринами и их обязками.
 */
@NgModule({
  declarations: [
    ScreenResolverComponent
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
    EpguLibModuleInited,
    InfoScreenModule,
  ],
  providers: [
    ScreenService,
    CurrentAnswersService,
    DictionaryApiService,
    ToolsService,
    CycledFieldsService
  ],
  exports: [
    ScreenResolverComponent
  ],
  entryComponents: [
    InfoScreenComponent,
    QuestionsScreenComponent,
    ComponentScreenComponent,
    CustomScreenComponent,
    UniqueScreenComponent,
    InvitationErrorScreenComponent,
    EmptyScreenComponent,
    ScreenResolverComponent,
  ]
})
export class ScreenModule {
  static rootEntry = ScreenResolverComponent;
}
