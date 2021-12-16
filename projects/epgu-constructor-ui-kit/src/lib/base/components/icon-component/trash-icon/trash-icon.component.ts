import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-trash-icon',
  templateUrl: './trash-icon.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TrashIconComponent extends BaseIconComponent {}
