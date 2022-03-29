import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-camera-icon',
  templateUrl: './location-icon.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LocationIconComponent extends BaseIconComponent {}
