import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'epgu-cf-ui-constructor-input-error',
  template: '<div class="error"><ng-content></ng-content></div>',
  styleUrls: ['./input-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputErrorComponent {}
