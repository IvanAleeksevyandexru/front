import { InfoScreenComponent } from './info-screen/info-screen.component';
import { QuestionsScreenComponent } from './questions-screen/questions-screen.component';
import { ComponentScreenComponent } from './component-screen/component-screen.component';
import { CustomScreenComponent } from './custom-screen/custom-screen.component';
import { UniqueScreenComponent } from './unique-screen/unique-screen.component';
import { InvitationErrorScreenComponent } from './invitation-error-screen/invitation-error-screen.component';
import { EmptyScreenComponent } from './empty-screen/empty-screen.component';
import { ScreenTypes } from './screen.types';
import { ComponentDto } from '../services/api/form-player-api/form-player-api.types';
import { UniqueScreenComponentTypes } from './unique-screen/unique-screen.types';

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

// TODO нужно утащить на backend (HARDCODE from backend)
export function shouldBeTakenFromTheCache(component: ComponentDto) {
  return !componentsNoCache.includes(component.type as any);
}

// TODO нужно утащить на backend (HARDCODE from backend)
const componentsNoCache = [
  UniqueScreenComponentTypes.carInfo,
];
