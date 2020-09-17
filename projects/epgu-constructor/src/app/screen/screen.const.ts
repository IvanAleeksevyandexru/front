import { InfoScreenComponent } from './info-screen/info-screen.component';
import { QuestionsScreenComponent } from './questions-screen/questions-screen.component';
import { ComponentScreenComponent } from './component-screen/component-screen.component';
import { CustomScreenComponent } from './custom-screen/custom-screen.component';
import { UniqueScreenComponent } from './unique-screen/unique-screen.component';
import { InvitationErrorScreenComponent } from './invitation-error-screen/invitation-error-screen.component';
import { EmptyScreenComponent } from './empty-screen/empty-screen.component';
import { ScreenTypes } from './screen.types';

export type ScreenComponent = typeof InfoScreenComponent
  | typeof QuestionsScreenComponent
  | typeof ComponentScreenComponent
  | typeof CustomScreenComponent
  | typeof UniqueScreenComponent
  | typeof InvitationErrorScreenComponent
  | typeof EmptyScreenComponent;

export const SCREEN_COMPONENTS: Readonly<{ [key in ScreenTypes]: ScreenComponent }> = {
  INFO: InfoScreenComponent,
  QUESTION: QuestionsScreenComponent,
  COMPONENT: ComponentScreenComponent,
  CUSTOM: CustomScreenComponent,
  UNIQUE: UniqueScreenComponent,
  INVITATION_ERROR: InvitationErrorScreenComponent,
  EMPTY: EmptyScreenComponent,
};
