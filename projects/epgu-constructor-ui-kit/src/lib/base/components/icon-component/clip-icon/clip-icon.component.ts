import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-clip-icon',
  templateUrl: './clip-icon.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ClipIconComponent extends BaseIconComponent {}
