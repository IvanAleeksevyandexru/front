import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-zoom-in-icon',
  templateUrl: './zoom-in.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ZoomInComponent extends BaseIconComponent {}
