import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { ListItem } from '@epgu/ui/models/dropdown';
import { Slot } from '../../../typings';

@Component({
  selector: 'epgu-constructor-time-slot-time',
  templateUrl: './time-slot-time.component.html',
  styleUrls: ['./time-slot-time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotTimeComponent {
  @Output() choose = new EventEmitter<Slot>();

  @Input() set list(list: Slot[]) {
    this.list$$.next(list);
  }

  @Input() set current(current: Slot) {
    this.current$$.next(current);
  }

  cache: Record<string, Slot> = {};
  list$$ = new BehaviorSubject<Slot[]>([]);
  list$ = this.list$$.pipe(
    tap(() => this.clearCache()),
    map((list: Slot[]) => this.createList(list)),
  );
  current$$ = new BehaviorSubject<Slot>(null);
  current$ = this.current$$.pipe(map((slot) => this.slotToItem(slot)));

  slotToItem(slot: Slot): ListItem {
    return slot ? new ListItem({ id: slot.slotId, text: slot.slotTime.toISOString() }) : null;
  }
  itemToSlot(item: ListItem): Slot {
    return item ? this.getCache(item.id as string) : null;
  }

  createList(list: Slot[]): ListItem[] {
    return list.map((slot) => {
      this.addCache(slot);
      return this.slotToItem(slot);
    });
  }

  getCache(id: string): Slot {
    return this.cache[id];
  }

  addCache(slot: Slot): void {
    this.cache[slot.slotId] = slot;
  }

  clearCache(): void {
    this.cache = {};
  }

  chooseAction(item: ListItem): void {
    this.choose.emit(this.itemToSlot(item));
  }
}
