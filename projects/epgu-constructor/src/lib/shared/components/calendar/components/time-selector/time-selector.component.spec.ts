import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { TimeSelectorComponent } from './time-selector.component';
import { ListItem } from '@epgu/ui/models/dropdown';
import { By } from '@angular/platform-browser';

describe('TimeSelectorComponent', () => {
  let component: TimeSelectorComponent;
  let fixture: ComponentFixture<TimeSelectorComponent>;

  const testListItem = new ListItem({ id: 'test', text: '2012-12-12' });
  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeSelectorComponent],
      imports: [],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSelectorComponent);
    component = fixture.componentInstance;
    component.list = [testListItem];
  });

  describe('base', () => {
    it('should be choose', () => {
      fixture.detectChanges();
      jest.spyOn(component, 'chooseAction');
      fixture.debugElement.query(By.css('.time-slot-item'))?.nativeElement?.click();
      expect(component.chooseAction).toHaveBeenCalledWith(testListItem);
    });
    it('should be selected', () => {
      component.current = testListItem;
      fixture.detectChanges();
      const element: HTMLDivElement = fixture.debugElement.query(By.css('.time-slot-item'))
        ?.nativeElement;
      expect(element?.classList.contains('selected')).toBeTruthy();
    });
  });
});
