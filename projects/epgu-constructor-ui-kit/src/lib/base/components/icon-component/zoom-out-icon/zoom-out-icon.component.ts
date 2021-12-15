import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-zoom-out-icon',
  templateUrl: './zoom-out-icon.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ZoomOutIconComponent extends BaseIconComponent {}
