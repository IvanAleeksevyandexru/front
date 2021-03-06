import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, NgControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  CoreUiModule,
  DatesToolsService,
  ConfigService,
  ConfigServiceStub,
  EventBusService,
  LoggerService,
  LoggerServiceStub,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { MockModule, MockProvider } from 'ng-mocks';
import {
  CustomComponent,
  CustomScreenComponentTypes,
  UpdateOn,
} from '../../../component/custom-screen/components-list.types';
import { DateRangeService } from '../../services/date-range/date-range.service';
import { CoreModule } from '../../../core/core.module';

import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { BaseModule } from '../../base.module';
import { ValidationService } from '../../services/validation/validation.service';
import { ValidationTypeModule } from './validation-type.module';
import { DateRestrictionsService } from '../../services/date-restrictions/date-restrictions.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';

const componentMockData: CustomComponent = {
  attrs: {
    validation: [
      {
        type: 'RegExp',
        value: '^[0-9]{2}$',
        ref: '',
        dataType: '',
        condition: '',
        errorMsg: 'Необходимо заполнить Серию',
        updateOn: UpdateOn.ON_BLUR,
      },
    ],
  },
  type: CustomScreenComponentTypes.StringInput,
  label: '',
  id: '12',
  value: '',
};

@Component({
  template: `
    <div [formGroup]="form">
      <input
        epgu-constructor-validation-type
        formControlName="value"
        [component]="componentMockData"
        id="test"
      />
    </div>
  `,
})
class MockComponent {
  @Input() componentMockData: CustomComponent;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      value: new FormControl({ value: '' }),
    });
  }
}
describe('ValidationTypeDirective', () => {
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;
  let service: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent],
      imports: [
        CoreModule,
        MockModule(CoreUiModule),
        ValidationTypeModule,
        RouterTestingModule,
        BaseModule,
        HttpClientTestingModule,
      ],
      providers: [
        ValidationService,
        CurrentAnswersService,
        NgControl,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        EventBusService,
        DateRangeService,
        DatesToolsService,
        UnsubscribeService,
        MockProvider(DateRestrictionsService),
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ValidationService);
    fixture = TestBed.createComponent(MockComponent);
    component = fixture.componentInstance;
    component.componentMockData = componentMockData;
    fixture.detectChanges();
  });

  it('should be call customAsyncValidator()', () => {
    const spy = jest.spyOn(service, 'customAsyncValidator');
    const input = fixture.debugElement.query(By.css('#test'));
    const inputNative: HTMLInputElement = input.nativeElement;

    input.triggerEventHandler('blur', { target: inputNative });
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should be not call customAsyncValidator()', () => {
    component.componentMockData.attrs = {};
    const spy = jest.spyOn(service, 'customAsyncValidator');
    const input = fixture.debugElement.query(By.css('#test'));
    const inputNative: HTMLInputElement = input.nativeElement;

    input.triggerEventHandler('blur', { target: inputNative });
    fixture.detectChanges();
    expect(spy).toBeCalledTimes(0);
  });
});
