import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-list-first-icon',
  templateUrl: './list-first-icon.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ListFirstIconComponent extends BaseIconComponent {}
