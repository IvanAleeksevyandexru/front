import { ApplicantAnswers, Display, Gender } from '../services/api/form-player-api/form-player-api.types';
import { NavigationPayload } from '../form-player.types';
import { InfoScreenComponent } from './info-screen/info-screen.component';
import { QuestionsScreenComponent } from './questions-screen/questions-screen.component';
import { ComponentScreenComponent } from './component-screen/component-screen.component';
import { CustomScreenComponent } from './custom-screen/custom-screen.component';
import { UniqueScreenComponent } from './unique-screen/unique-screen.component';
import { InvitationErrorScreenComponent } from './invitation-error-screen/invitation-error-screen.component';
import { EmptyScreenComponent } from './empty-screen/empty-screen.component';


export interface ScreenStore {
  display: Display,
  errors?: object,
  gender?: Gender,
  currentCycledFields?: object
  applicantAnswers?: ApplicantAnswers;
}

export interface Screen {
  screenStore: ScreenStore,
  prevStep: (data?: NavigationPayload) => void,
  nextStep: (data?: NavigationPayload) => void,
}

export const SCREEN_COMPONENTS: Readonly<{ [key: string]: any }> = {
  INFO: InfoScreenComponent,
  QUESTION: QuestionsScreenComponent,
  COMPONENT: ComponentScreenComponent,
  CUSTOM: CustomScreenComponent,
  UNIQUE: UniqueScreenComponent,
  INVITATION_ERROR: InvitationErrorScreenComponent,
  EMPTY: EmptyScreenComponent,
};
