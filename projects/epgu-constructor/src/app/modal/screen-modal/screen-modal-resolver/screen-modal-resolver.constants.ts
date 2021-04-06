import { ComponentListModalComponent } from '../components/component-list-modal/component-list-modal.component';
import { UniqueComponentModalComponent } from '../components/unique-component-modal/unique-component-modal.component';
import { InfoComponentModalComponent } from '../components/info-component-modal/info-component-modal.component';

export type ScreenModalComponentsType =
  | ComponentListModalComponent
  | UniqueComponentModalComponent
  | InfoComponentModalComponent;

export const ScreenModalComponents = {
  CUSTOM: ComponentListModalComponent,
  UNIQUE: UniqueComponentModalComponent,
  INFO: InfoComponentModalComponent,
};
