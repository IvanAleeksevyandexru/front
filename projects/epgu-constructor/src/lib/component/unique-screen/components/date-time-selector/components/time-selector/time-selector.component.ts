import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Slot } from '../../typings';

@Component({
  selector: 'epgu-constructor-time-selector',
  templateUrl: './time-selector.component.html',
  styleUrls: ['./time-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSelectorComponent {
  @Input() list: Slot[];
  @Input() currentSlot: Slot;
  @Output() choose = new EventEmitter<Slot>();

  chooseAction(slot: Slot): void {
    this.choose.emit(slot);
  }
}
