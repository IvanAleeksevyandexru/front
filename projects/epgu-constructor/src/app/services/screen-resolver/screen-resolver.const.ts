import { InfoScreenComponent } from '../../screen/info-screen/info-screen.component';
import { QuestionsScreenComponent } from '../../screen/questions-screen/questions-screen.component';
import { InvitationErrorScreenComponent } from '../../screen/invitation-error-screen/invitation-error-screen.component';
import { ComponentScreenComponent } from '../../screen/component-screen/component-screen.component';
import { CustomScreenComponent } from '../../screen/custom-screen/custom-screen.component';
import { UniqueScreenComponent } from '../../screen/unique-screen/unique-screen.component';
import { EmptyScreenComponent } from '../../screen/empty-screen/empty-screen.component';

export const SCREEN_COMPONENTS = {
  INFO: InfoScreenComponent,
  QUESTION: QuestionsScreenComponent,
  COMPONENT: ComponentScreenComponent,
  CUSTOM: CustomScreenComponent,
  UNIQUE: UniqueScreenComponent,
  INVITATION_ERROR: InvitationErrorScreenComponent,
  EMPTY: EmptyScreenComponent,
};
