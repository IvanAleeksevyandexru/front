import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FocusManagerService } from './focus-manager.service';
import { EpguLibModule, PlainInputComponent, ValidationShowOn } from '@epgu/epgu-lib';
import { By } from '@angular/platform-browser';

import { FormControl } from '@angular/forms';
import { ConstructorPlainInputComponent } from '../../../shared/components/constructor-plain-input/constructor-plain-input.component';

import { ValidationTypeModule } from '../../../shared/directives/validation-type/validation-type.module';
import { CurrencyModule } from '../../../shared/directives/currency/currency.module';
import { TextTransformModule, TrimModule } from '@epgu/epgu-constructor-ui-kit';
import { RankModule } from '../../../shared/directives/rank/rank.module';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { DateRangeService } from '../../../shared/services/date-range/date-range.service';
import { DatesToolsService } from '../dates-tools/dates-tools.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { DateRestrictionsService } from '../../../shared/services/date-restrictions/date-restrictions.service';

describe('FocusManagerService', () => {
  let service: FocusManagerService;
  let fixture: ComponentFixture<ConstructorPlainInputComponent>;
  let component: ConstructorPlainInputComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FocusManagerService,
        ValidationService,
        DateRangeService,
        DatesToolsService,
        EventBusService,
        DateRestrictionsService,
      ],
      imports: [
        EpguLibModule,
        ValidationTypeModule,
        CurrencyModule,
        TrimModule,
        TextTransformModule,
        RankModule,
      ],
      declarations: [ConstructorPlainInputComponent],
    });
    fixture = TestBed.createComponent(ConstructorPlainInputComponent);
    service = TestBed.inject(FocusManagerService);
    component = fixture.componentInstance;
    component.control = new FormControl({ id: 'test' });
    component.name = 'test';
    component.validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
    fixture.detectChanges();
  });

  it('should be focus event in state', (done) => {
    service.stateComponent$('test').subscribe((v) => {
      expect(v?.current?.name).toBe('test');
      done();
    });
    const element: PlainInputComponent = fixture.debugElement.query(By.css('lib-plain-input'))
      ?.componentInstance;

    element.notifyFocusEvent(new FocusEvent('focus'));
    fixture.detectChanges();
  });
});
