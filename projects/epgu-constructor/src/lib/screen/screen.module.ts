import { NgModule } from '@angular/core';
import { DictionaryToolsService } from '../shared/services/dictionary/dictionary-tools.service';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { ModalModule } from '../modal/modal.module';
import { BaseModule } from '../shared/base.module';
import { CachedAnswersService } from '../shared/services/cached-answers/cached-answers.service';
import { HtmlRemoverService } from '../shared/services/html-remover/html-remover.service';
import { PrepareComponentsService } from '../shared/services/prepare-components/prepare-components.service';
import { CurrentAnswersService } from './current-answers.service';
import { CustomScreenComponent } from './custom-screen/custom-screen.component';
import { CustomScreenModule } from './custom-screen/custom-screen.module';
import { EmptyScreenComponent } from './empty-screen/empty-screen.component';
import { EmptyScreenModule } from './empty-screen/empty-screen.module';
import { InfoScreenComponent } from './info-screen/info-screen.component';
import { InfoScreenModule } from './info-screen/info-screen.module';
import { InvitationErrorScreenComponent } from './invitation-error-screen/invitation-error-screen.component';
import { InvitationErrorScreenModule } from './invitation-error-screen/invitation-error-screen.module';
import { QuestionsScreenComponent } from './questions-screen/questions-screen.component';
import { QuestionsScreenModule } from './questions-screen/questions-screen.module';
import { ScreenResolverComponent } from './screen-resolver/screen-resolver.component';
import { ScreenService } from './screen.service';
import { UniqueScreenComponent } from './unique-screen/unique-screen.component';
import { UniqueScreenModule } from './unique-screen/unique-screen.module';
import { RefRelationService } from '../shared/services/ref-relation/ref-relation.service';
import { RepeatableScreenModule } from './repeatable-screen/repeatable-screen.module';
import { AppScreenModule } from './app-screen/app-screen.module';
import { AppScreenComponent } from './app-screen/app-screen.component';
import { UniquenessErrorsService } from '../shared/services/uniqueness-errors/uniqueness-errors.service';
import { EaisdoGroupCostService } from '../shared/services/eaisdo-group-cost/eaisdo-group-cost.service';
import { CertificateEaisdoService } from '../shared/services/certificate-eaisdo/certificate-eaisdo.service';

/**
 * Домен скринов. Здесь храниться всё что связанно со скринами и их обязками.
 */
@NgModule({
  declarations: [ScreenResolverComponent],
  imports: [
    AppScreenModule,
    BaseModule,
    CustomScreenModule,
    EmptyScreenModule,
    InfoScreenModule,
    InvitationErrorScreenModule,
    ModalModule,
    QuestionsScreenModule,
    RepeatableScreenModule,
    UniqueScreenModule,
  ],
  providers: [
    CachedAnswersService,
    CertificateEaisdoService,
    CurrentAnswersService,
    DatesToolsService,
    DictionaryToolsService,
    EaisdoGroupCostService,
    EventBusService,
    HtmlRemoverService,
    PrepareComponentsService,
    RefRelationService,
    ScreenService,
    UniquenessErrorsService,
  ],
  exports: [ScreenResolverComponent],
  entryComponents: [
    AppScreenComponent,
    CustomScreenComponent,
    EmptyScreenComponent,
    InfoScreenComponent,
    InvitationErrorScreenComponent,
    QuestionsScreenComponent,
    ScreenResolverComponent,
    UniqueScreenComponent,
  ],
})
export class ScreenModule {
  static rootEntry = ScreenResolverComponent;
}
