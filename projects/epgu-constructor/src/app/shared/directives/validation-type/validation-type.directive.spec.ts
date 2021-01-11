import { ValidationTypeDirective } from './validation-type.directive';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup, NgControl } from '@angular/forms';

import {
  CustomComponent,
  CustomScreenComponentTypes,
} from '../../../component/components-list/components-list.types';
import { ValidationService } from '../../services/validation/validation.service';
import { ValidationTypeModule } from './validation-type.module';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '../../../core/core.module';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { BaseModule } from '../../base.module';
import { DateRangeService } from '../../../component/components-list/services/date-range/date-range.service';

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
      imports: [CoreModule, ValidationTypeModule, RouterTestingModule, BaseModule],
      providers: [
        ValidationService,
        NgControl,
        { provide: ScreenService, useClass: ScreenServiceStub },
        DateRangeService,
      ],
    });
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
