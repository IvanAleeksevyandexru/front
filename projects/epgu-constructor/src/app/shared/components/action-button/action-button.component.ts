import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'epgu-constructor-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionButtonComponent {}
