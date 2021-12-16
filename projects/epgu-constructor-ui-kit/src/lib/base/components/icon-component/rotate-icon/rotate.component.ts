import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-rotate-icon',
  templateUrl: './rotate.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class RotateComponent extends BaseIconComponent {}
