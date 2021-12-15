import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-complete-form-icon',
  templateUrl: './complete-form-icon.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CompleteFormIconComponent extends BaseIconComponent {}
