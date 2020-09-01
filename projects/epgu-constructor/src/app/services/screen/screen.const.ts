import { InfoScreenComponent } from '../../screens/info-screen/info-screen.component';
import { QuestionsScreenComponent } from '../../screens/questions-screen/questions-screen.component';
import { InvitationErrorScreenComponent } from '../../screens/invitation-error-screen/invitation-error-screen.component';
import { ComponentScreenComponent } from '../../screens/component-screen/component-screen.component';
import { CustomScreenComponent } from '../../screens/custom-screen/custom-screen.component';
import { UniqueScreenComponent } from '../../screens/unique-screen/unique-screen.component';

export const SCREEN_COMPONENTS = {
  INFO: InfoScreenComponent,
  QUESTION: QuestionsScreenComponent,
  COMPONENT: ComponentScreenComponent,
  CUSTOM: CustomScreenComponent,
  UNIQUE: UniqueScreenComponent,
  INVITATION_ERROR: InvitationErrorScreenComponent,
};
