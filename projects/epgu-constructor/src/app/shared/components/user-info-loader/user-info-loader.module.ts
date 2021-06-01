import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { ScreenService } from '../../../screen/screen.service';
import { UserInfoLoaderComponent } from './user-info-loader.component';
import { CycledInfoComponent } from './components/cycled-info/cycled-info.component';

@NgModule({
  declarations: [
    UserInfoLoaderComponent,
    UserInfoComponent,
    CycledInfoComponent,
  ],
  providers: [ScreenService],
  imports: [CommonModule],
  exports: [UserInfoLoaderComponent],
})
export class UserInfoLoaderModule {}
