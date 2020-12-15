import { ValidationTypeDirective } from './validation-type.directive';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
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

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MockComponent],
        imports: [ValidationTypeModule, RouterTestingModule, CoreModule],
        providers: [
          ValidationService,
          NgControl,
          { provide: ScreenService, useClass: ScreenServiceStub },
        ],
      });
      service = TestBed.inject(ValidationService);
      fixture = TestBed.createComponent(MockComponent);
      component = fixture.componentInstance;
      component.componentMockData = componentMockData;
      fixture.detectChanges();
    }),
  );

  it('should create an instance', () => {
    // const input = fixture.debugElement.query(By.css('#test'));
    // const inputNative: HTMLInputElement = input.nativeElement;
    //
    // input.triggerEventHandler('blur', { target: inputNative });
    // fixture.detectChanges();
    //
    // jest.spyOn(service, 'customAsyncValidator');
    // service.customAsyncValidator(componentMockData, 'blur');
    // const fn = jest.spyOn(service, 'customAsyncValidator');
    // expect(service.customAsyncValidator).toHaveBeenCalled();

    expect(component).toBeTruthy();
  });
});
