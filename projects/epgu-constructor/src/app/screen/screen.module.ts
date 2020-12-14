import { NgModule } from '@angular/core';
import { InvitationErrorScreenModule } from './invitation-error-screen/invitation-error-screen.module';
import { UniqueScreenModule } from './unique-screen/unique-screen.module';
import { QuestionsScreenModule } from './questions-screen/questions-screen.module';
import { EmptyScreenModule } from './empty-screen/empty-screen.module';
import { CustomScreenModule } from './custom-screen/custom-screen.module';
import { ComponentScreenModule } from './component-screen/component-screen.module';
import { InfoScreenModule } from './info-screen/info-screen.module';
import { InfoScreenComponent } from './info-screen/info-screen.component';
import { QuestionsScreenComponent } from './questions-screen/questions-screen.component';
import { ComponentScreenComponent } from './component-screen/component-screen.component';
import { EmptyScreenComponent } from './empty-screen/empty-screen.component';
import { UniqueScreenComponent } from './unique-screen/unique-screen.component';
import { CustomScreenComponent } from './custom-screen/custom-screen.component';
import { InvitationErrorScreenComponent } from './invitation-error-screen/invitation-error-screen.component';
import { ScreenResolverComponent } from './screen-resolver/screen-resolver.component';
import { CurrentAnswersService } from './current-answers.service';
import { ScreenService } from './screen.service';
import { CoreModule } from '../core/core.module';
import { ModalModule } from '../modal/modal.module';
import { CachedAnswersService } from '../shared/services/applicant-answers/cached-answers.service';

/**
 * Домен скринов. Здесь храниться всё что связанно со скринами и их обязками.
 */
@NgModule({
  declarations: [ScreenResolverComponent],
  imports: [
    CoreModule,
    ComponentScreenModule,
    CustomScreenModule,
    EmptyScreenModule,
    QuestionsScreenModule,
    UniqueScreenModule,
    InvitationErrorScreenModule,
    InfoScreenModule,
    ModalModule,
  ],
  providers: [ScreenService, CachedAnswersService, CurrentAnswersService],
  exports: [ScreenResolverComponent],
  entryComponents: [
    InfoScreenComponent,
    QuestionsScreenComponent,
    ComponentScreenComponent,
    CustomScreenComponent,
    UniqueScreenComponent,
    InvitationErrorScreenComponent,
    EmptyScreenComponent,
    ScreenResolverComponent,
  ],
})
export class ScreenModule {
  static rootEntry = ScreenResolverComponent;
}
