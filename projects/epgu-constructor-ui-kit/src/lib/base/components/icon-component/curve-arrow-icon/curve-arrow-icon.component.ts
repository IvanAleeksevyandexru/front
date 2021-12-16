import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-curve-arrow-icon',
  templateUrl: './curve-arrow-icon.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CurveArrowIconComponent extends BaseIconComponent {}
