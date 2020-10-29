import { Component, Input } from '@angular/core';

import { TimerInterface } from '../../models/timer.interface';

@Component({
  selector: 'epgu-constructor-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent {
  @Input() timer: TimerInterface;
}
