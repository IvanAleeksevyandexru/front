import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-clock-icon',
  templateUrl: './clock-icon.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ClockIconComponent extends BaseIconComponent {}
