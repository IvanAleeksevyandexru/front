import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeSlotEmptyErrorComponent } from './time-slot-empty-error.component';
import { BaseModule } from '../../../../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../../../../shared/components/base-components/base-components.module';
import { By } from '@angular/platform-browser';

const mockTemplate = {
  header: 'test',
  description: 'test-description',
};
describe('TimeSlotEmptyErrorComponent', () => {
  let component: TimeSlotEmptyErrorComponent;
  let fixture: ComponentFixture<TimeSlotEmptyErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeSlotEmptyErrorComponent],
      imports: [BaseModule, BaseComponentsModule],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSlotEmptyErrorComponent);
    component = fixture.componentInstance;
    component.error = mockTemplate;
  });

  describe('base', () => {
    it('should be render header', () => {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('h4'))?.nativeElement?.innerHTML?.trim()).toBe(
        mockTemplate.header,
      );
    });
    it('should be render description', () => {
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('.helper-text'))?.nativeElement?.innerHTML?.trim(),
      ).toBe(mockTemplate.description);
    });
  });
});
