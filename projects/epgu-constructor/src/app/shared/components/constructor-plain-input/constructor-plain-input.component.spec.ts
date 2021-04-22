import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ValidationShowOn } from 'epgu-lib';
import { DateRangeService } from '../../services/date-range/date-range.service';
import { CoreModule } from '../../../core/core.module';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { BaseModule } from '../../base.module';
import { CurrencyModule } from '../../directives/currency/currency.module';
import { RankModule } from '../../directives/rank/rank.module';
import { TextTransformModule } from '../../directives/text-transform/text-transform.module';
import { TrimModule } from '../../directives/trim/trim.module';
import { ValidationTypeModule } from '../../directives/validation-type/validation-type.module';
import { ValidationService } from '../../services/validation/validation.service';
import { ConstructorPlainInputComponent } from './constructor-plain-input.component';
import { TextTransform } from 'epgu-constructor-types/dist/base/text-transform';

describe('ConstructorPlainInputComponent', () => {
  let component: ConstructorPlainInputComponent;
  let fixture: ComponentFixture<ConstructorPlainInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstructorPlainInputComponent],
      imports: [
        CoreModule,
        BaseModule,
        RouterTestingModule,
        TrimModule,
        TextTransformModule,
        CurrencyModule,
        RankModule,
        ValidationTypeModule,
      ],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        EventBusService,
        ValidationService,
        DateRangeService,
        DatesToolsService,
        UnsubscribeService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorPlainInputComponent);
    component = fixture.componentInstance;
    component.placeholder = '';
    component.price = true;
    component.control = new FormControl();
    component.id = '';
    component.invalid = true;
    component.validationShowOn = ValidationShowOn.TOUCHED;
    component.textTransformType = TextTransform.ALL;
    component.type = 'number';
    component.maxlength = 2;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
