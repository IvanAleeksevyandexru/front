import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-move-icon',
  templateUrl: './move-icon.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MoveIconComponent extends BaseIconComponent {}
