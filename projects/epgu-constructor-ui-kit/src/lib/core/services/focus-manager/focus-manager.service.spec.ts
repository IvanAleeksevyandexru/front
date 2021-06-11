import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FocusManagerService } from './focus-manager.service';
import { EpguLibModule, PlainInputComponent, ValidationShowOn } from '@epgu/epgu-lib';
import { By } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { ConstructorPlainInputComponent } from '@epgu/epgu-constructor/src/lib/shared/components/constructor-plain-input/constructor-plain-input.component';
import { ValidationTypeModule } from '@epgu/epgu-constructor/src/lib/shared/directives/validation-type/validation-type.module';
import { CurrencyModule } from '@epgu/epgu-constructor/src/lib/shared/directives/currency/currency.module';
import { RankModule } from '@epgu/epgu-constructor/src/lib/shared/directives/rank/rank.module';
import { ValidationService } from '@epgu/epgu-constructor/src/lib/shared/services/validation/validation.service';
import { DateRangeService } from '@epgu/epgu-constructor/src/lib/shared/services/date-range/date-range.service';
import { DatesToolsService } from '../dates-tools/dates-tools.service';
import { DateRestrictionsService } from '@epgu/epgu-constructor/src/lib/shared/services/date-restrictions/date-restrictions.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { TrimModule } from '../../../base/directives/trim/trim.module';
import { TextTransformModule } from '../../../base/directives/text-transform/text-transform.module';
import { ConfigService } from '../config/config.service';
import { LoggerService } from '../logger/logger.service';

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
        ConfigService,
        LoggerService,
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
