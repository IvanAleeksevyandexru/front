import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-filter-icon',
  templateUrl: './filter-icon.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FilterIconComponent extends BaseIconComponent {}
