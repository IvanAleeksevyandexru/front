import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { TimeSlotTimeComponent } from './time-slot-time.component';
import { MockModule } from 'ng-mocks';
import { CalendarModule } from '../../../../../../../shared/components/calendar/calendar.module';
import { Slot } from '../../../typings';
import { ListItem } from '@epgu/ui/models/dropdown';

const createMockSlot = (id: string, date: string) =>
  ({
    slotId: id,
    timezone: '+3',
    slotTime: new Date(date),
  } as Slot);

const baseSlotMock = {
  slotId: 'id',
  timezone: '+3',
  slotTime: new Date('2012-12-12T00:00:00.000Z'),
};

describe('TimeSlotTimeComponent', () => {
  let component: TimeSlotTimeComponent;
  let fixture: ComponentFixture<TimeSlotTimeComponent>;

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeSlotTimeComponent],
      imports: [MockModule(CalendarModule)],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSlotTimeComponent);
    component = fixture.componentInstance;
  });

  describe('base', () => {
    it('should be slotToItem', () => {
      expect(component.slotToItem(createMockSlot('id', '2012-12-12'))).toEqual(
        new ListItem({ id: 'id', text: '2012-12-12T00:00:00.000Z' }),
      );
    });

    it('should be itemToSlot', () => {
      expect(new ListItem({ id: 'id', text: '2012-12-12T00:00:00.000Z' })).toEqual(
        component.slotToItem(createMockSlot('id', '2012-12-12')),
      );
    });

    it('should be createList', () => {
      const list = component.createList([
        createMockSlot('id', '2012-12-12'),
        createMockSlot('id2', '2012-12-13'),
      ]);
      const testCase = [
        new ListItem({ id: 'id', text: '2012-12-12T00:00:00.000Z' }),
        new ListItem({ id: 'id2', text: '2012-12-13T00:00:00.000Z' }),
      ];
      expect(list).toEqual(testCase);

      expect(component.cache).toEqual({
        id: baseSlotMock,
        id2: { slotId: 'id2', timezone: '+3', slotTime: new Date('2012-12-13T00:00:00.000Z') },
      });
    });

    it('should be addCache & getCache', () => {
      component.addCache(baseSlotMock);
      expect(component.getCache('id')).toBe(baseSlotMock);
    });

    it('should be clearCache', () => {
      component.addCache(baseSlotMock);
      expect(component.getCache('id')).toBe(baseSlotMock);
      component.clearCache();
      expect(component.cache).toEqual({});
    });

    it('should be chooseAction', () => {
      jest.spyOn(component.choose, 'emit');
      component.chooseAction(new ListItem({ id: '2012-12', text: '2012-12' }));
      expect(component.choose.emit).toHaveBeenCalled();
    });
  });
});
