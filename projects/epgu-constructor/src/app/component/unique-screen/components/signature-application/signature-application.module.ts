import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { SignatureApplicationComponent } from './components/signature-application.component';
import { CoreModule } from '../../../../core/core.module';

const COMPONENTS = [SignatureApplicationComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [],
  imports: [CoreModule, SharedModule],
})
export class SignatureApplicationModule {}
