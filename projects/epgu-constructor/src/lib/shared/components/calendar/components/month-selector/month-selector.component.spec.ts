import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { MonthSelectorComponent } from './month-selector.component';
import { FormsModule } from '@angular/forms';
import { BaseModule } from '../../../../base.module';
import { ConfigService, ConfigServiceStub, DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { ListItem } from '@epgu/ui/models/dropdown';

describe('MonthSelectorComponent', () => {
  let component: MonthSelectorComponent;
  let fixture: ComponentFixture<MonthSelectorComponent>;
  let dateService: DatesToolsService;

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthSelectorComponent],
      providers: [DatesToolsService, { provide: ConfigService, useClass: ConfigServiceStub }],
      imports: [BaseModule, FormsModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    dateService = TestBed.inject(DatesToolsService);
    fixture = TestBed.createComponent(MonthSelectorComponent);
    component = fixture.componentInstance;
    component.availableMonths$$.next(['2012-12', '2012-11']);
    component.hideProvider$$.next(() => false);
  });

  describe('base', () => {
    it('should be choose', () => {
      fixture.detectChanges();
      jest.spyOn(component, 'chooseAction');
      fixture.debugElement.query(By.css('.dropdown-item'))?.nativeElement?.click();
      expect(component.chooseAction).toHaveBeenCalled();
    });

    it('should be monthsRange', () => {
      const testText = 'test';
      component.monthsRange = testText;
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('.months-range'))?.nativeElement?.innerHTML?.trim(),
      ).toBe(testText);
    });

    it('should be createItem', () => {
      expect(component.createItem('2012-10')).toEqual(
        new ListItem({ id: '2012-10', text: 'Октябрь 2012' }),
      );
    });

    it('should be getList', () => {
      expect(component.getList(['2012-10', '2012-11'], () => false)).toEqual([
        new ListItem({ id: '2012-10', text: 'Октябрь 2012' }),
        new ListItem({ id: '2012-11', text: 'Ноябрь 2012' }),
      ]);
    });
  });
});
