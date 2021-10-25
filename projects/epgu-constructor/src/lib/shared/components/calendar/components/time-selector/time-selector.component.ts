import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ListItem } from '@epgu/ui/models/dropdown';

@Component({
  selector: 'epgu-constructor-time-selector',
  templateUrl: './time-selector.component.html',
  styleUrls: ['./time-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSelectorComponent {
  @Input() list: ListItem[];
  @Input() current: ListItem;

  @Output() choose = new EventEmitter<ListItem>();

  chooseAction(item: ListItem): void {
    this.choose.emit(item);
  }
}
