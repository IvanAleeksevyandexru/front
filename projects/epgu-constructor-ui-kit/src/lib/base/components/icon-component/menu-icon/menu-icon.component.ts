import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-menu-icon',
  templateUrl: './menu-icon.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MenuIconComponent extends BaseIconComponent {}
