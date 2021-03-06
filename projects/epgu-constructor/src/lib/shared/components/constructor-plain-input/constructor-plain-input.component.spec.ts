import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import {
  CoreUiModule,
  DatesToolsService,
  ConfigService,
  ConfigServiceStub,
  EventBusService,
  LoggerService,
  LoggerServiceStub,
  CurrencyModule,
  RankPipeModule,
  UnsubscribeService,
  TextTransformModule,
  TrimModule,
} from '@epgu/epgu-constructor-ui-kit';
import { TextTransform } from '@epgu/epgu-constructor-types';
import { MockModule, MockProvider } from 'ng-mocks';
import { DateRangeService } from '../../services/date-range/date-range.service';
import { CoreModule } from '../../../core/core.module';

import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { BaseModule } from '../../base.module';

import { ValidationTypeModule } from '../../directives/validation-type/validation-type.module';
import { ValidationService } from '../../services/validation/validation.service';
import { ConstructorPlainInputComponent } from './constructor-plain-input.component';
import { DateRestrictionsService } from '../../services/date-restrictions/date-restrictions.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';

describe('ConstructorPlainInputComponent', () => {
  let component: ConstructorPlainInputComponent;
  let fixture: ComponentFixture<ConstructorPlainInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructorPlainInputComponent],
      imports: [
        CoreModule,
        MockModule(CoreUiModule),
        BaseModule,
        RouterTestingModule,
        TrimModule,
        TextTransformModule,
        CurrencyModule,
        RankPipeModule,
        ValidationTypeModule,
      ],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        EventBusService,
        ValidationService,
        CurrentAnswersService,
        DateRangeService,
        DatesToolsService,
        UnsubscribeService,
        MockProvider(DateRestrictionsService),
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
