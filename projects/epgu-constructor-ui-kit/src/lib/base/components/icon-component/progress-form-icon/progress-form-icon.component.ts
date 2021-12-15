import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-progress-form-icon',
  templateUrl: './progress-form-icon.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ProgressFormIconComponent extends BaseIconComponent {}
