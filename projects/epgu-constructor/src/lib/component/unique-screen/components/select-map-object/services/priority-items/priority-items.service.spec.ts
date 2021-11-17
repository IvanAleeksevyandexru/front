import { TestBed } from '@angular/core/testing';

import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';

import { PriorityItemsService } from './priority-items.service';
import { DictionaryItem } from '../../../../../../shared/services/dictionary/dictionary-api.types';
import { take, takeLast } from 'rxjs/operators';

const mockCreateItem = (CODE: string) => {
  const attributeValues = { CODE };
  return ({ attributeValues } as unknown) as DictionaryItem;
};

describe('PriorityItemsService', () => {
  let service: PriorityItemsService;
  let screenService: ScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PriorityItemsService, { provide: ScreenService, useClass: ScreenServiceStub }],
    });
    screenService = TestBed.inject(ScreenService);
    const kindergartenAttrs = { listMaxLength: 8, nextStepLength: 11 };
    screenService.component = {
      id: 'test',
      type: 'TimeSlot',
      attrs: { mapKindergartenPriorityAttrs: kindergartenAttrs },
    };
    service = TestBed.inject(PriorityItemsService);
  });

  describe('base', () => {
    it('should be lowerByItems', () => {
      const items = [
        ({ item1: true } as unknown) as DictionaryItem,
        ({ item2: true } as unknown) as DictionaryItem,
        ({ item3: true } as unknown) as DictionaryItem,
      ];
      expect(service.lowerByItems(items, 1)).toEqual([
        ({ item1: true } as unknown) as DictionaryItem,
        ({ item3: true } as unknown) as DictionaryItem,
        ({ item2: true } as unknown) as DictionaryItem,
      ]);
    });
    it('should be lower', () => {
      const items = [
        ({ item1: true } as unknown) as DictionaryItem,
        ({ item2: true } as unknown) as DictionaryItem,
      ];
      const screenItems = [
        ({ screenItem1: true } as unknown) as DictionaryItem,
        ({ screenItem2: true } as unknown) as DictionaryItem,
      ];
      jest.spyOn(service, 'updateItems');
      jest.spyOn(service, 'updateScreenItems');
      jest.spyOn(service, 'getItems').mockReturnValueOnce(items);
      jest.spyOn(service, 'getScreenItems').mockReturnValueOnce(screenItems);
      service.lower(0);
      expect(service.updateItems).toHaveBeenCalledWith([
        ({ item2: true } as unknown) as DictionaryItem,
        ({ item1: true } as unknown) as DictionaryItem,
      ]);
      expect(service.updateScreenItems).toHaveBeenCalledWith([
        ({ screenItem2: true } as unknown) as DictionaryItem,
        ({ screenItem1: true } as unknown) as DictionaryItem,
      ]);
    });
    it('should be raiseByItems', () => {
      const items = [
        ({ item1: true } as unknown) as DictionaryItem,
        ({ item2: true } as unknown) as DictionaryItem,
        ({ item3: true } as unknown) as DictionaryItem,
      ];
      expect(service.raiseByItems(items, 2)).toEqual([
        ({ item1: true } as unknown) as DictionaryItem,
        ({ item3: true } as unknown) as DictionaryItem,
        ({ item2: true } as unknown) as DictionaryItem,
      ]);
    });
    it('should be raise', () => {
      const items = [
        ({ item1: true } as unknown) as DictionaryItem,
        ({ item2: true } as unknown) as DictionaryItem,
      ];
      const screenItems = [
        ({ screenItem1: true } as unknown) as DictionaryItem,
        ({ screenItem2: true } as unknown) as DictionaryItem,
      ];
      jest.spyOn(service, 'updateItems');
      jest.spyOn(service, 'updateScreenItems');
      jest.spyOn(service, 'getItems').mockReturnValueOnce(items);
      jest.spyOn(service, 'getScreenItems').mockReturnValueOnce(screenItems);
      service.raise(1);
      expect(service.updateItems).toHaveBeenCalledWith([
        ({ item2: true } as unknown) as DictionaryItem,
        ({ item1: true } as unknown) as DictionaryItem,
      ]);
      expect(service.updateScreenItems).toHaveBeenCalledWith([
        ({ screenItem2: true } as unknown) as DictionaryItem,
        ({ screenItem1: true } as unknown) as DictionaryItem,
      ]);
    });
    it('should be removeByItems', () => {
      const testValues = { CODE: '15' };
      const item = ({ attributeValues: testValues } as unknown) as DictionaryItem;
      const item2 = ({ test: 1 } as unknown) as DictionaryItem;
      expect(service.removeByItems([item, item2], item)).toEqual([item2]);
    });
    it('should be remove', () => {
      jest.spyOn(service, 'getStep').mockReturnValue(2);
      const items = [mockCreateItem('1'), mockCreateItem('2')];
      jest.spyOn(service, 'getItems').mockReturnValue(items);
      jest.spyOn(service, 'getScreenItems').mockReturnValue(items);

      const test1 = mockCreateItem('3');
      const test2 = mockCreateItem('2');
      const test3 = [mockCreateItem('1')];
      expect(service.remove(mockCreateItem('3'))).toEqual({
        index: -1,
        isAdded: true,
        item: test1,
      });
      jest.spyOn(service, 'moreBySize');
      jest.spyOn(service, 'updateItems');
      jest.spyOn(service, 'updateScreenItems');
      expect(service.remove(mockCreateItem('2'))).toEqual({
        index: 1,
        isAdded: true,
        item: test2,
      });
      expect(service.updateItems).toHaveBeenCalledWith(test3);
      expect(service.updateScreenItems).toHaveBeenCalledWith(test3);
      expect(service.moreBySize).toHaveBeenCalledWith(1);
    });
    it('should be cancel', () => {
      jest.spyOn(service, 'updateItems');
      jest.spyOn(service, 'updateScreenItems');
      const items = [mockCreateItem('1'), mockCreateItem('2')];
      const change = mockCreateItem('3');
      jest.spyOn(service, 'getItems').mockReturnValue([...items]);
      jest.spyOn(service, 'getScreenItems').mockReturnValue([...items]);

      service.cancel({ index: 1, item: change, isAdded: true });

      expect(service.updateItems).toHaveBeenCalledWith([items[0], change, items[1]]);
      expect(service.updateScreenItems).toHaveBeenCalledWith([items[0], change]);
    });
    it('should be cancelByItems', () => {
      const items = [mockCreateItem('1'), mockCreateItem('2')];
      const change = mockCreateItem('3');

      expect(
        service.cancelByItems([...items], { index: 1, item: change, isAdded: false }),
      ).toEqual([items[0], change, items[1]]);
      expect(
        service.cancelByItems([...items], { index: 1, item: change, isAdded: true }, true),
      ).toEqual([items[0], change]);
    });
    it('should be updateScreenItems', () => {
      jest.spyOn(service.screenItems, 'next');
      service.updateScreenItems([]);

      expect(service.screenItems.next).toHaveBeenCalledWith([]);
    });
    it('should be updateItems', () => {
      jest.spyOn(service.items, 'next');
      service.updateItems([]);

      expect(service.items.next).toHaveBeenCalledWith([]);
    });
    it('should be getScreenItems', () => {
      const items = [mockCreateItem('1')];
      service.screenItems.next(items);
      expect(service.getScreenItems()).toEqual(items);
    });
    it('should be getItems', () => {
      const items = [mockCreateItem('1')];
      service.items.next(items);
      expect(service.getItems()).toEqual(items);
    });
    it('should be reset', () => {
      const items = [mockCreateItem('1')];
      service.items.next(items);
      jest.spyOn(service, 'set');
      service.reset();
      expect(service.set).toHaveBeenCalledWith(items);
    });
    it('should be more', () => {
      jest.spyOn(service, 'getStep').mockReturnValue(1);
      jest.spyOn(service, 'moreBySize');
      service.more();
      expect(service.moreBySize).toHaveBeenCalledWith(1);
    });
    it('should be moreBySize', () => {
      jest.spyOn(service, 'getScreenItems').mockReturnValue([mockCreateItem('1')]);
      jest
        .spyOn(service, 'getItems')
        .mockReturnValue([mockCreateItem('1'), mockCreateItem('2'), mockCreateItem('3')]);

      jest.spyOn(service, 'updateScreenItems');

      service.moreBySize(1);

      expect(service.updateScreenItems).toBeCalledWith([mockCreateItem('1'), mockCreateItem('2')]);

      service.moreBySize(6);
      expect(service.updateScreenItems).toBeCalledWith([
        mockCreateItem('1'),
        mockCreateItem('2'),
        mockCreateItem('3'),
        null,
        null,
        null,
        null,
      ]);

      jest
        .spyOn(service, 'getScreenItems')
        .mockReturnValue([mockCreateItem('1'), mockCreateItem('2'), mockCreateItem('3')]);
      service.moreBySize(2);
      expect(service.updateScreenItems).toBeCalledWith([
        mockCreateItem('1'),
        mockCreateItem('2'),
        mockCreateItem('3'),
        null,
        null,
      ]);
    });
    it('should be getStep', () => {
      jest.spyOn(service, 'getScreenItems').mockReturnValue([mockCreateItem('1')]);
      jest.spyOn(service, 'getItems').mockReturnValue([mockCreateItem('1'), mockCreateItem('1')]);
      service.maxKindergarten = 1;

      expect(service.getStep()).toBe(1);
      service.nextStepLength = 2;
      service.maxKindergarten = 5;
      expect(service.getStep()).toBe(2);
      service.nextStepLength = 5;
      expect(service.getStep()).toBe(4);
    });
    it('should be init', () => {
      jest.spyOn(service, 'set');
      service.init(100, []);

      expect(service.listMaxLength).toBe(8);
      expect(service.nextStepLength).toBe(11);
      expect(service.maxKindergarten).toBe(100);
      expect(service.set).toHaveBeenCalled();
    });
    it('should be set', () => {
      jest.spyOn(service, 'updateScreenItems');
      jest.spyOn(service, 'getInitSize').mockReturnValueOnce(1);
      const item = ({ test: true } as unknown) as DictionaryItem;
      service.maxKindergarten = 5;
      service.listMaxLength = 4;
      service.set([item, item, item]);
      expect(service.updateScreenItems).toHaveBeenCalledWith([item]);
      service.listMaxLength = 4;
      service.set([item, item, item]);

      expect(service.updateScreenItems).toHaveBeenCalledWith([
        { test: true },
        { test: true },
        { test: true },
        null,
      ]);
      jest.spyOn(service, 'getInitSize').mockReturnValueOnce(5);
      service.listMaxLength = 2;
      service.set([item, item, item]);
      expect(service.updateScreenItems).toHaveBeenCalledWith([item, item, item]);
    });
    it('should be getInitSize', () => {
      service.init(100, []);
      expect(service.getInitSize()).toBe(service.listMaxLength);
      service.init(2, []);
      expect(service.getInitSize()).toBe(service.maxKindergarten);
    });
    it('should be leftItems$', (done) => {
      jest.spyOn(service, 'getStep');
      service.leftItems$.pipe(take(1)).subscribe(() => {
        expect(service.getStep).toHaveBeenCalled();
        done();
      });
      service.init(1, [({} as unknown) as DictionaryItem, ({} as unknown) as DictionaryItem]);
    });
    it('should be disabled$$ = true', (done) => {
      service.init(1, [({} as unknown) as DictionaryItem, ({} as unknown) as DictionaryItem]);
      service.disabled$$.subscribe((status) => {
        expect(status).toBeTruthy();
        done();
      });
    });
    it('should be disabled$$ = false', (done) => {
      service.init(15, [({} as unknown) as DictionaryItem, ({} as unknown) as DictionaryItem]);
      service.disabled$$.subscribe((status) => {
        expect(status).toBeFalsy();
        done();
      });
    });
  });
});
