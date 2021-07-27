import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { MockComponents, MockDirective, MockModule } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService, HttpCancelService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ConfirmPersonalUserAddressComponent } from './confirm-personal-user-address.component';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { UniqueScreenComponentTypes } from '../../../../unique-screen-components.types';
import { SuggestHandlerService } from '../../../../../../shared/services/suggest-handler/suggest-handler.service';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenPadModule, TextTransformDirective } from '@epgu/epgu-constructor-ui-kit';
import { ValidationTypeModule } from '../../../../../../shared/directives/validation-type/validation-type.module';
import { AddressItemComponent } from '../address-item/address-item.component';
import { DadataWidgetComponent, DatePickerComponent, PlainInputComponent } from '@epgu/epgu-lib';
import { LabelComponent } from '../../../../../../shared/components/base-components/label/label.component';
import { HelperTextComponent } from '@epgu/epgu-constructor-ui-kit';
import { DefaultUniqueScreenWrapperComponent } from '../../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.component';
import { FieldNames } from '../../../registration-addr/registration-addr-screen.types';
import { SuggestMonitorService } from '../../../../../../shared/services/suggest-monitor/suggest-monitor.service';
import { HealthService } from '@epgu/epgu-constructor/src/lib/core/services/health/health.service';
import { HealthServiceStub } from '@epgu/epgu-constructor-ui-kit';

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
  },
  id: '',
  value: '{}',
  type: UniqueScreenComponentTypes.confirmPersonalUserRegAddr,
  required: true,
};

describe('ConfirmPersonalUserAddressComponent', () => {
  let component: ConfirmPersonalUserAddressComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserAddressComponent>;
  let screenService: ScreenService;

  configureTestSuite(() => {
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
          DatePickerComponent,
          LabelComponent,
          HelperTextComponent,
          DefaultUniqueScreenWrapperComponent,
          DadataWidgetComponent,
          PlainInputComponent,
        ),
        MockDirective(TextTransformDirective),
      ],
      providers: [
        UnsubscribeService,
        CurrentAnswersService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: HealthService, useClass: HealthServiceStub },
        DatesToolsService,
        SuggestHandlerService,
        EventBusService,
        FormBuilder,
        HttpCancelService,
        SuggestMonitorService,
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
});
