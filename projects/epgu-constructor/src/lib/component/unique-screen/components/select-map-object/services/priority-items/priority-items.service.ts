import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { DictionaryItem } from '../../../../../../shared/services/dictionary/dictionary-api.types';
import { filter, map } from 'rxjs/operators';
import { ScreenService } from '../../../../../../screen/screen.service';

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
  maxKindergarten$$ = new BehaviorSubject<number>(null);
  maxKindergarten$ = this.maxKindergarten$$.pipe(filter((status) => !!status));
  disabled$$ = combineLatest([this.maxKindergarten$, this.items]).pipe(
    map(([max, items]) => items.length > max),
  );
  leftItems$ = combineLatest([this.maxKindergarten$, this.screenItems]).pipe(
    map(() => this.getStep()),
  );

  listMaxLength$$ = new BehaviorSubject<number>(6);

  get listMaxLength(): number {
    return this.listMaxLength$$.getValue();
  }
  set listMaxLength(length: number) {
    this.listMaxLength$$.next(length);
  }

  nextStepLength$$ = new BehaviorSubject<number>(10);
  get nextStepLength(): number {
    return this.nextStepLength$$.getValue();
  }
  set nextStepLength(length: number) {
    this.nextStepLength$$.next(length);
  }

  set maxKindergarten(max: number) {
    this.maxKindergarten$$.next(max);
  }
  get maxKindergarten(): number {
    return this.maxKindergarten$$.getValue();
  }

  constructor(private screenService: ScreenService) {}

  getInitSize(): number {
    return this.maxKindergarten > this.listMaxLength ? this.listMaxLength : this.maxKindergarten;
  }

  set(dictItems: DictionaryItem[]): void {
    const items = [...dictItems];
    this.items.next(items);
    const size = this.getInitSize();
    if (items.length > size) {
      this.updateScreenItems(items.slice(0, size));
    } else if (items.length < this.listMaxLength) {
      this.updateScreenItems(items.concat(new Array(size - items.length).fill(null)));
    } else {
      this.updateScreenItems(items);
    }
  }

  init(max: number, dictItems: DictionaryItem[]): void {
    this.listMaxLength =
      this.screenService.component.attrs?.mapKindergartenPriorityAttrs?.listMaxLength || 6;
    this.nextStepLength =
      this.screenService.component.attrs?.mapKindergartenPriorityAttrs?.nextStepLength || 10;
    this.maxKindergarten = max;
    this.set(dictItems);
  }

  getStep(): number {
    const items = this.getScreenItems();

    const selectedSize = this.getItems().length;
    let add = 0;
    if (selectedSize > this.maxKindergarten) {
      add = selectedSize - this.maxKindergarten;
    }
    const diff = this.maxKindergarten - items.length + add;
    return diff > this.nextStepLength ? this.nextStepLength : diff;
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
