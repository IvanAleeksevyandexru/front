import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-map-icon',
  templateUrl: './map-icon.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MapIconComponent extends BaseIconComponent {}
