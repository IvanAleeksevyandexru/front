import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfoComponent } from '../user-info/user-info.component';
import { ScreenService } from '../../../screen/screen.service';
import { UserInfoLoaderComponent } from './user-info-loader.component';

@NgModule({
  declarations: [UserInfoComponent, UserInfoLoaderComponent],
  providers: [ScreenService],
  imports: [CommonModule],
  exports: [UserInfoLoaderComponent],
})
export class UserInfoLoaderModule {}
