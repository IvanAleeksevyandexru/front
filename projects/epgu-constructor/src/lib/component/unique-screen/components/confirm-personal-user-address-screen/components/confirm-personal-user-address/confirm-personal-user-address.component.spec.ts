import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockComponents, MockDirective, MockModule, MockProvider } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ConfigService,
  DatesToolsServiceStub,
  HttpCancelService,
  ConfigServiceStub,
  DatesToolsService,
  EventBusService,
  ScreenPadModule,
  TextTransformDirective,
  HelperTextComponent,
  HealthServiceStub,
  HealthService,
} from '@epgu/epgu-constructor-ui-kit';

import { DadataWidgetComponent, PlainInputComponent } from '@epgu/ui/controls';
import { Observable, of } from 'rxjs';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ConfirmPersonalUserAddressComponent } from './confirm-personal-user-address.component';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';

import { UniqueScreenComponentTypes } from '../../../../unique-screen-components.types';
import { SuggestHandlerService } from '../../../../../../shared/services/suggest-handler/suggest-handler.service';

import { ValidationTypeModule } from '../../../../../../shared/directives/validation-type/validation-type.module';
import { AddressItemComponent } from '../address-item/address-item.component';
import { LabelComponent } from '../../../../../../shared/components/base-components/label/label.component';

import { DefaultUniqueScreenWrapperComponent } from '../../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.component';
import { FieldNames } from '../../../registration-addr/registration-addr-screen.types';
import { SuggestMonitorService } from '../../../../../../shared/services/suggest-monitor/suggest-monitor.service';

import { ConstructorDatePickerComponent } from '../../../../../../shared/components/constructor-date-picker/constructor-date-picker.component';
import { ValidationService } from '../../../../../../shared/services/validation/validation.service';
import { ValidationServiceStub } from '../../../../../../shared/services/validation/validation.service.stub';
import { ScreenContent } from '../../../../../../screen/screen-content';

const mockData = {
  attrs: {
    fields: [
      {
        fieldName: FieldNames.regAddr,
        label: 'Адрес',
      },
      {
        fieldName: FieldNames.regDate,
        label: 'Дата регистрации',
      },
    ],
    emptyFieldsErrorMsg: 'Проверьте форму — не все поля заполнены',
  },
  id: '',
  value: '{}',
  type: UniqueScreenComponentTypes.confirmPersonalUserRegAddr,
  required: true,
  errors: ' ',
};

const mockErrors = {
  house: {
    desc: 'Неверный номер дома 1',
    icon: 'red-line',
    title: 'Ошибка дома',
    type: 'error',
  },
  houseTitleClone: {
    desc: 'Неверный номер дома 2',
    icon: 'red-line',
    title: 'Ошибка дома',
    type: 'error',
  },
  apartment: {
    desc: 'Неверный номер квартиры',
    icon: 'red-line',
    title: 'Ошибка квартиры',
    type: 'error',
  },
  apartmentFullClone: {
    desc: 'Неверный номер квартиры',
    icon: 'red-line',
    title: 'Ошибка квартиры',
    type: 'error',
  },
};

const mockGroupedErrors = [
  {
    desc: `Неверный номер дома 1 <br> Неверный номер дома 2`,
    icon: 'red-line',
    title: 'Ошибка дома',
    type: 'error',
  },
  {
    desc: 'Неверный номер квартиры',
    icon: 'red-line',
    title: 'Ошибка квартиры',
    type: 'error',
  },
];

const mockUniqueErrors = {
  house: {
    desc: 'Неверный номер дома',
    icon: 'red-line',
    title: 'Ошибка дома',
    type: 'error',
  },
  apartment: {
    desc: 'Неверный номер квартиры',
    icon: 'red-line',
    title: 'Ошибка квартиры',
    type: 'error',
  },
};

const mockGroupedUniqueErrors = [
  {
    desc: 'Неверный номер дома',
    icon: 'red-line',
    title: 'Ошибка дома',
    type: 'error',
  },
  {
    desc: 'Неверный номер квартиры',
    icon: 'red-line',
    title: 'Ошибка квартиры',
    type: 'error',
  },
];

describe('ConfirmPersonalUserAddressComponent', () => {
  let component: ConfirmPersonalUserAddressComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserAddressComponent>;
  let screenService: ScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MockModule(ScreenPadModule),
        MockModule(ValidationTypeModule),
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      declarations: [
        AddressItemComponent,
        ConfirmPersonalUserAddressComponent,
        MockComponents(
          ConstructorDatePickerComponent,
          LabelComponent,
          HelperTextComponent,
          DefaultUniqueScreenWrapperComponent,
          DadataWidgetComponent,
          PlainInputComponent,
        ),
        MockDirective(TextTransformDirective),
      ],
      providers: [
        CurrentAnswersService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: HealthService, useClass: HealthServiceStub },
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        { provide: ValidationService, useClass: ValidationServiceStub },
        MockProvider(SuggestHandlerService),
        MockProvider(EventBusService),
        MockProvider(HttpCancelService),
        MockProvider(SuggestMonitorService),
      ],
    })
      .overrideComponent(ConfirmPersonalUserAddressComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserAddressComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);
    screenService.component = mockData as any;
  });

  it('should render epgu-constructor-default-unique-screen-wrapper', () => {
    const debugEl = fixture.debugElement.query(
      By.css('epgu-constructor-default-unique-screen-wrapper'),
    );
    fixture.detectChanges();
    expect(debugEl).toBeTruthy();
    expect(debugEl.componentInstance.header).toBeNull();
    expect(debugEl.componentInstance.isLoading).toBeFalsy();
    expect(debugEl.componentInstance.buttons).toBeUndefined();
    expect(debugEl.componentInstance.showNav).toBeFalsy();
    expect(debugEl.componentInstance.isValid).toBeFalsy();
  });

  describe('update value', () => {
    it('currentAnswersService.isValid', () => {
      fixture.detectChanges();
      component.form.get('regAddr').setValue('fake addr');
      expect(component.currentAnswersService.isValid).toBeFalsy();
      component.form.get('regDate').setValue('01.01.2000');
      expect(component.currentAnswersService.isValid).toBeTruthy();
    });

    it('currentAnswersService.state', () => {
      fixture.detectChanges();
      component.form.get('regAddr').setValue('bar');
      expect(component.currentAnswersService.state).toBe(
        JSON.stringify({ regAddr: 'bar', regDate: null }),
      );
    });
  });

  describe('nonPresetable', () => {
    const value = JSON.stringify({ regAddr: 'foo', regDate: '01.04.2021' });

    it('should set all fields if haven`t nonPresetable', () => {
      screenService.component = { ...mockData, value } as any;
      fixture.detectChanges();
      expect(component.currentAnswersService.state).toBe(value);
    });

    it('should set without nonPresetable fields', () => {
      screenService.component = {
        attrs: {
          fields: [
            {
              fieldName: FieldNames.regAddr,
              label: 'Адрес',
              nonPresetable: true,
            },
            {
              fieldName: FieldNames.regDate,
              label: 'Дата регистрации',
            },
          ],
        },
        value,
      } as any;
      fixture.detectChanges();
      expect(component.currentAnswersService.state).toBe(
        JSON.stringify({ regAddr: null, regDate: '01.04.2021' }),
      );
    });
  });

  describe('render', () => {
    it('should render "empty-fields" block when state is invalid', () => {
      jest.spyOn(component.currentAnswersService, 'isValid$', 'get').mockReturnValue(of(false));

      fixture.detectChanges();

      const selector = '.empty-fields';
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });
  });

  describe('getGroupedErrors()', () => {
    it('should return grouped errors by title and deleted non-unique errors by title and desc', () => {
      const groupedErrors = (component as any).getGroupedErrors(Object.values(mockErrors));

      expect(groupedErrors).toEqual(mockGroupedErrors);
    });

    it('should return same errors if they are unique', () => {
      const groupedErrors = (component as any).getGroupedErrors(Object.values(mockUniqueErrors));

      expect(groupedErrors).toEqual(mockGroupedUniqueErrors);
    });
  });

  describe('setErrors()', () => {
    it('should set string error', () => {
      expect(component.stringError).toEqual('');
      expect(component.groupedErrors).toEqual([]);

      (component as any).setErrors('Error');

      expect(component.stringError).toEqual('Error');
      expect(component.groupedErrors).toEqual([]);
    });

    it('should set grouped errors', () => {
      expect(component.stringError).toEqual('');
      expect(component.groupedErrors).toEqual([]);

      (component as any).setErrors(JSON.stringify(mockErrors));

      expect(component.stringError).toEqual('');
      expect(component.groupedErrors).toEqual(mockGroupedErrors);
    });

    it('should reset errors', () => {
      (component as any).setErrors('Error');

      expect(component.stringError).toEqual('Error');
      expect(component.groupedErrors).toEqual([]);

      (component as any).setErrors(JSON.stringify(mockErrors));

      expect(component.stringError).toEqual('');
      expect(component.groupedErrors).toEqual(mockGroupedErrors);

      (component as any).setErrors('Error');

      expect(component.stringError).toEqual('Error');
      expect(component.groupedErrors).toEqual([]);

      (component as any).setErrors('');

      expect(component.stringError).toEqual('');
      expect(component.groupedErrors).toEqual([]);
    });
  });
});
