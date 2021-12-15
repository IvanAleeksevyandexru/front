import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-direction-arrow-icon',
  templateUrl: './direction-arrow-icon.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DirectionArrowIconComponent extends BaseIconComponent {}
