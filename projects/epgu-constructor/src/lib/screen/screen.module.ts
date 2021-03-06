import { NgModule } from '@angular/core';
import { DatesToolsService, EventBusService } from '@epgu/epgu-constructor-ui-kit';

import { DictionaryToolsService } from '../shared/services/dictionary/dictionary-tools.service';
import { ModalModule } from '../modal/modal.module';
import { BaseModule } from '../shared/base.module';
import { CachedAnswersService } from '../shared/services/cached-answers/cached-answers.service';
import { HtmlRemoverService } from '../shared/services/html-remover/html-remover.service';
import { PrepareComponentsService } from '../shared/services/prepare-components/prepare-components.service';
import { CurrentAnswersService } from './current-answers.service';
import { CustomScreenModule } from './custom-screen/custom-screen.module';
import { EmptyScreenModule } from './empty-screen/empty-screen.module';
import { InfoScreenModule } from './info-screen/info-screen.module';
import { InvitationErrorScreenModule } from './invitation-error-screen/invitation-error-screen.module';
import { QuestionsScreenModule } from './questions-screen/questions-screen.module';
import { ScreenResolverComponent } from './screen-resolver/screen-resolver.component';
import { ScreenService } from './screen.service';
import { UniqueScreenModule } from './unique-screen/unique-screen.module';
import { RefRelationService } from '../shared/services/ref-relation/ref-relation.service';
import { RepeatableScreenModule } from './repeatable-screen/repeatable-screen.module';
import { AppScreenModule } from './app-screen/app-screen.module';
import { UniquenessErrorsService } from '../shared/services/uniqueness-errors/uniqueness-errors.service';
import { EaisdoGroupCostService } from '../shared/services/eaisdo-group-cost/eaisdo-group-cost.service';
import { CertificateEaisdoService } from '../shared/services/certificate-eaisdo/certificate-eaisdo.service';
import { InterpolationService } from '../shared/services/interpolation/interpolation.service';

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
    InterpolationService,
    PrepareComponentsService,
    RefRelationService,
    ScreenService,
    UniquenessErrorsService,
  ],
  exports: [ScreenResolverComponent],
})
export class ScreenModule {
  static rootEntry = ScreenResolverComponent;
}
