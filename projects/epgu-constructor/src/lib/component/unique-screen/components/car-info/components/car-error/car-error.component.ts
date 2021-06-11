import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'epgu-constructor-car-error',
  templateUrl: './car-error.component.html',
  styleUrls: ['./car-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarErrorComponent {
  @Input() iconClass: string;
  @Input() title: string;
  @Input() text: string;
}
