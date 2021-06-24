import { Type } from '@angular/core';

import { ScreenTypes } from '@epgu/epgu-constructor-types';
import { InfoScreenComponent } from './info-screen/info-screen.component';
import { QuestionsScreenComponent } from './questions-screen/questions-screen.component';
import { CustomScreenComponent } from './custom-screen/custom-screen.component';
import { UniqueScreenComponent } from './unique-screen/unique-screen.component';
import { InvitationErrorScreenComponent } from './invitation-error-screen/invitation-error-screen.component';
import { EmptyScreenComponent } from './empty-screen/empty-screen.component';
import { RepeatableScreenComponent } from './repeatable-screen/repeatable-screen.component';
import { AppScreenComponent } from './app-screen/app-screen.component';

export type ScreenComponent =
  | InfoScreenComponent
  | QuestionsScreenComponent
  | CustomScreenComponent
  | RepeatableScreenComponent
  | UniqueScreenComponent
  | InvitationErrorScreenComponent
  | EmptyScreenComponent
  | AppScreenComponent;

export const SCREEN_COMPONENTS: Readonly<{ [key in ScreenTypes]: Type<ScreenComponent> }> = {
  INFO: InfoScreenComponent,
  QUESTION: QuestionsScreenComponent,
  CUSTOM: CustomScreenComponent,
  REPEATABLE: RepeatableScreenComponent,
  UNIQUE: UniqueScreenComponent,
  INVITATION_ERROR: InvitationErrorScreenComponent,
  EMPTY: EmptyScreenComponent,
  APP: AppScreenComponent,
};
