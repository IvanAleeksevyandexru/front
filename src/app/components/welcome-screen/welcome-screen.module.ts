import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
<<<<<<< HEAD:src/app/components/welcome-screen/welcome-screen.module.ts
import {SharedComponentsModule} from '../shared-components/shared-components.module';
import {WelcomeScreenComponent} from './welcome-screen.component';
import {EpguLibModule} from 'epgu-lib';
=======
import {WelcomeBlockComponent} from './welcome-block.component';
>>>>>>> ef358ca... [EPGU-267]:src/app/modules/screen/components/welcome-block/screens/welcome-block-screen/welcome-block.module.ts

const COMPONENTS = [
  WelcomeScreenComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
  ]
})
export class WelcomeScreenModule { }
