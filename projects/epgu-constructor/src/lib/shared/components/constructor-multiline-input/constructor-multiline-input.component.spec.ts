import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import {
  CoreUiModule,
  DatesToolsService,
  ObjectHelperService,
  WordTransformService,
  ConfigService,
  ConfigServiceStub,
  EventBusService,
  LoggerService,
  LoggerServiceStub,
  TextTransformModule,
  TrimModule,
} from '@epgu/epgu-constructor-ui-kit';
import { By } from '@angular/platform-browser';
import { TextTransform } from '@epgu/epgu-constructor-types';
import { MockProvider } from 'ng-mocks';
import { DateRangeService } from '../../services/date-range/date-range.service';
import { CoreModule } from '../../../core/core.module';

import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { BaseModule } from '../../base.module';

import { ValidationTypeModule } from '../../directives/validation-type/validation-type.module';
import { ValidationService } from '../../services/validation/validation.service';
import { ConstructorMultilineInputComponent } from './constructor-multiline-input.component';
import { DateRestrictionsService } from '../../services/date-restrictions/date-restrictions.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';

describe('ConstructorMultilineInputComponent', () => {
  let component: ConstructorMultilineInputComponent;
  let fixture: ComponentFixture<ConstructorMultilineInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructorMultilineInputComponent],
      imports: [
        CoreModule,
        CoreUiModule,
        BaseModule,
        RouterTestingModule,
        TrimModule,
        TextTransformModule,
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
        MockProvider(DateRestrictionsService),
        WordTransformService,
        ObjectHelperService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorMultilineInputComponent);
    component = fixture.componentInstance;
    component.placeholder = '';
    component.control = new FormControl();
    component.id = '';
    component.invalid = true;
    component.validationShowOn = ValidationShowOn.TOUCHED;
    component.textTransformType = TextTransform.ALL;
    component.commitOnInput = true;
    component.maxlength = 4;
    fixture.detectChanges();
  });

  it('check input', () => {
    const editInput: HTMLDivElement = fixture.debugElement.query(By.css('.multiline-input'))
      .nativeElement;

    const text = 'text';
    editInput.innerHTML = text;
    editInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.control.value).toBe(text);
  });
});
