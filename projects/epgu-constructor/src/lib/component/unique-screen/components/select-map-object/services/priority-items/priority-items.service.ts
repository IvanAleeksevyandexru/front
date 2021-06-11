import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { DictionaryItem } from '../../../../../../shared/services/dictionary/dictionary-api.types';
import { filter, map } from 'rxjs/operators';

export interface CancelContext {
  index: number;
  isAdded: boolean;
  item: DictionaryItem;
}

@Injectable()
export class PriorityItemsService {
  status = new BehaviorSubject<boolean>(false);
  items = new BehaviorSubject<DictionaryItem[]>([]);
  screenItems = new BehaviorSubject<(DictionaryItem | null)[]>([]);
  maxKinderGarden$$ = new BehaviorSubject<number>(null);
  maxKinderGarden$ = this.maxKinderGarden$$.pipe(filter((status) => !!status));
  disabled$$ = combineLatest([this.maxKinderGarden$, this.items]).pipe(
    map(([max, items]) => items.length > max),
  );
  leftItems$ = combineLatest([this.maxKinderGarden$, this.screenItems]).pipe(
    map(() => this.getStep()),
  );
  moreSize$ = combineLatest([this.maxKinderGarden$, this.items]).pipe(
    map(([max, items]) => items.length - max),
  );

  oldMaxKinderGarden$$ = new BehaviorSubject<number>(null);
  oldMaxKinderGarden$ = this.oldMaxKinderGarden$$.pipe(filter((status) => !!status));
  maxIsChange$ = combineLatest([this.oldMaxKinderGarden$, this.maxKinderGarden$]).pipe(
    map(([old, now]) => old !== now),
  );
  set oldMaxKinderGarden(max: number) {
    this.oldMaxKinderGarden$$.next(max > 50 ? 50 : max);
  }
  get oldMaxKinderGarden(): number {
    return this.oldMaxKinderGarden$$.getValue();
  }

  set maxKinderGarden(max: number) {
    this.maxKinderGarden$$.next(max > 50 ? 50 : max);
  }
  get maxKinderGarden(): number {
    return this.maxKinderGarden$$.getValue();
  }

  getInitSize(): number {
    return this.maxKinderGarden > 6 ? 6 : this.maxKinderGarden;
  }

  set(dictItems: DictionaryItem[]): void {
    const items = [...dictItems];
    this.items.next(items);
    const size = this.getInitSize();
    if (items.length > size) {
      this.updateScreenItems(items.slice(0, size));
    } else if (items.length < 6) {
      this.updateScreenItems(items.concat(new Array(size - items.length).fill(null)));
    } else {
      this.updateScreenItems(items);
    }
  }
  init(oldMax: number, max: number, dictItems: DictionaryItem[]): void {
    this.oldMaxKinderGarden = oldMax;
    this.maxKinderGarden = max;
    this.set(dictItems);
  }
  getStep(): number {
    const items = this.getScreenItems();

    const selectedSize = this.getItems().length;
    let add = 0;
    if (selectedSize > this.maxKinderGarden) {
      add = selectedSize - this.maxKinderGarden;
    }
    const diff = this.maxKinderGarden - items.length + add;
    return diff > 10 ? 10 : diff;
  }

  moreBySize(size: number): void {
    const items = this.getScreenItems();
    const selectedItems = this.getItems();

    const itemsSize = items.length; // 6
    const selectedItemsSize = selectedItems.length; // 24

    if (selectedItemsSize - itemsSize >= size) {
      this.updateScreenItems(items.concat(selectedItems.slice(itemsSize, itemsSize + size)));
    } else if (selectedItemsSize > itemsSize) {
      const sliceSize = selectedItemsSize - itemsSize;
      this.updateScreenItems(
        items
          .concat(selectedItems.slice(itemsSize, selectedItemsSize))
          .concat(new Array(size - sliceSize).fill(null)),
      );
    } else {
      this.updateScreenItems(items.concat(new Array(size).fill(null)));
    }
  }

  more(): void {
    this.moreBySize(this.getStep());
  }

  reset(): void {
    this.set(this.items.getValue());
  }

  getItems(): DictionaryItem[] {
    return [...this.items.getValue()];
  }

  getScreenItems(): DictionaryItem[] {
    return [...this.screenItems.getValue()];
  }

  updateItems(items: DictionaryItem[]): void {
    this.items.next(items);
  }

  updateScreenItems(items: DictionaryItem[]): void {
    this.screenItems.next(items);
  }

  cancelByItems(
    items: DictionaryItem[],
    context: CancelContext,
    isLastRemove = false,
  ): DictionaryItem[] {
    items.splice(context.index, 0, context.item);
    if (context.isAdded && isLastRemove) {
      items.pop();
    }
    return items;
  }

  cancel(context: CancelContext): void {
    this.updateItems(this.cancelByItems(this.getItems(), context));
    this.updateScreenItems(this.cancelByItems(this.getScreenItems(), context, true));
  }

  remove(item: DictionaryItem): CancelContext {
    const size = this.getStep();
    const result = { index: -1, isAdded: size > 0, item };
    const index = this.getItems().findIndex(
      (dictionaryItem) => dictionaryItem?.attributeValues?.CODE === item?.attributeValues?.CODE,
    );
    if (index === -1) {
      return result;
    }
    result.index = index;
    this.updateItems(this.removeByItems(this.getItems(), item));
    this.updateScreenItems(this.removeByItems(this.getScreenItems(), item));
    if (size > 0) {
      this.moreBySize(1);
    }

    return result;
  }

  removeByItems(items: DictionaryItem[], item: DictionaryItem): DictionaryItem[] {
    return items.filter(
      (dictionaryItem) => dictionaryItem?.attributeValues?.CODE != item?.attributeValues?.CODE,
    );
  }

  raise(index: number): void {
    this.updateItems(this.raiseByItems(this.getItems(), index));
    this.updateScreenItems(this.raiseByItems(this.getScreenItems(), index));
  }

  raiseByItems(items: DictionaryItem[], index: number): DictionaryItem[] {
    const now = items[index];
    const raiseItem = items[index - 1];

    items.splice(index - 1, 2, now, raiseItem);

    return items;
  }

  lower(index: number): void {
    this.updateItems(this.lowerByItems(this.getItems(), index));
    this.updateScreenItems(this.lowerByItems(this.getScreenItems(), index));
  }

  lowerByItems(items: DictionaryItem[], index: number): DictionaryItem[] {
    const now = items[index];
    const lowerItem = items[index + 1];

    items.splice(index, 2, lowerItem, now);

    return items;
  }
}