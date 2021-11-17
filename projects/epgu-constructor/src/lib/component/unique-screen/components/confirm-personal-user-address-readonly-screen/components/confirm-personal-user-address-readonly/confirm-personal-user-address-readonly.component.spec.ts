import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ConfigService,
  DATE_STRING_DOT_FORMAT,
  HttpCancelService,
} from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ConfirmAddressInterface } from '../../interface/confirm-address.interface';
import { ConfirmPersonalUserAddressReadonlyComponent } from './confirm-personal-user-address-readonly.component';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { of } from 'rxjs';
import { UniqueScreenComponentTypes } from '../../../../unique-screen-components.types';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { MockComponent, MockDirective, MockModule } from 'ng-mocks';
import { ScreenPadModule, TextTransformDirective } from '@epgu/epgu-constructor-ui-kit';
import { ValidationTypeModule } from '../../../../../../shared/directives/validation-type/validation-type.module';
import { LabelComponent } from '../../../../../../shared/components/base-components/label/label.component';
import { HelperTextComponent, SafePipe } from '@epgu/epgu-constructor-ui-kit';
import { DefaultUniqueScreenWrapperComponent } from '../../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.component';
import { ActionDirective } from '../../../../../../shared/directives/action/action.directive';
import { ActionType, ComponentActionDto, DisclaimerDtoType } from '@epgu/epgu-constructor-types';
import { FieldNames } from '../../../registration-addr/registration-addr-screen.types';
import { ImgPrefixerPipe } from '@epgu/epgu-constructor-ui-kit';
import { DisclaimerComponent } from '../../../../../../shared/components/disclaimer/disclaimer.component';
import { ConstructorDatePickerComponent } from '../../../../../../shared/components/constructor-date-picker/constructor-date-picker.component';
import { DadataWidgetComponent, PlainInputComponent } from '@epgu/ui/controls';
import { By } from '@angular/platform-browser';

describe('ConfirmPersonalUserAddressReadonlyComponent', () => {
  const mockData: ConfirmAddressInterface = {
    attrs: {
      actions: [],
      fields: [
        {
          fieldName: 'regAddr' as FieldNames,
          label: 'Адрес',
        },
        {
          fieldName: 'regDate' as FieldNames,
          label: 'Дата регистрации',
          hint: 'Дату регистрации можно найти на штампе о регистрации на стр. 5-12 паспорта РФ',
        },
      ],
      disclaimer: {
        level: null,
        clarifications: null,
        uniquenessErrors: null,
        type: DisclaimerDtoType.warn,
        title: 'Добавьте адрес',
        description:
          'Адрес постоянной регистрации нужен для отправки заявления. Этот адрес сохранится в профиле, и в будущих заявлениях не придется вводить его заново',
      },
      emptyFieldsErrorMsg: 'Проверьте форму — не все поля заполнены',
    },
    id: '',
    value: '{}',
    presetValue: '{}',
    label: '',
    type: UniqueScreenComponentTypes.confirmPersonalUserRegAddr,
    required: true,
    valueFromCache: false,
  };
  const actionMock: ComponentActionDto = {
    label: '',
    value: '',
    action: null,
    type: ActionType.nextStepModal,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MockModule(ScreenPadModule),
        MockModule(ValidationTypeModule),
      ],
      declarations: [
        ConfirmPersonalUserAddressReadonlyComponent,
        MockComponent(ConstructorDatePickerComponent),
        MockDirective(TextTransformDirective),
        MockDirective(ActionDirective),
        MockComponent(LabelComponent),
        MockComponent(HelperTextComponent),
        MockComponent(DefaultUniqueScreenWrapperComponent),
        MockComponent(DadataWidgetComponent),
        MockComponent(PlainInputComponent),
        MockComponent(DisclaimerComponent),
        SafePipe,
        ImgPrefixerPipe,
      ],
      providers: [
        UnsubscribeService,
        CurrentAnswersService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        DatesToolsService,
        HttpCancelService,
      ],
    }).compileComponents();
  });

  function setup(data: ConfirmAddressInterface = mockData) {
    const fixture: ComponentFixture<ConfirmPersonalUserAddressReadonlyComponent> = TestBed.createComponent(
      ConfirmPersonalUserAddressReadonlyComponent,
    );
    const component: ConfirmPersonalUserAddressReadonlyComponent = fixture.componentInstance;
    const screenService: ScreenService = TestBed.inject(ScreenService);
    const currentAnswersService: CurrentAnswersService = TestBed.inject(CurrentAnswersService);
    const dateService: DatesToolsService = TestBed.inject(DatesToolsService);
    jest.spyOn(screenService, 'action', 'get').mockReturnValue(actionMock);
    jest.spyOn(screenService, 'componentErrors', 'get').mockReturnValue({});
    component.data$ = of(data);
    fixture.detectChanges();

    return { fixture, component, screenService, currentAnswersService, dateService };
  }

  it('should create', () => {
    const { component } = setup();
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    it('should update values and currentAnswersService state on receive value changes from form', () => {
      const { component, currentAnswersService } = setup();

      jest.spyOn(component.form.valueChanges, 'pipe').mockReturnValue(of({ regAddr: 'Some addr' }));

      component.ngOnInit();

      expect(component.valueParsed).toEqual({ regDate: null, regAddr: 'Some addr' });
      expect(currentAnswersService.state).toEqual(
        JSON.stringify({ regDate: null, regAddr: 'Some addr' }),
      );
    });

    it('should update values and currentAnswersService state on receive value changes with date', () => {
      const { component, currentAnswersService } = setup();

      const datesToolsService: DatesToolsService = TestBed.inject(DatesToolsService);
      jest.spyOn(datesToolsService, 'format').mockImplementation((value: string) => value);
      jest
        .spyOn(component.form.valueChanges, 'pipe')
        .mockReturnValue(of({ regAddr: 'Some addr', regDate: '2021-05-11' }));

      component.ngOnInit();

      expect(component.valueParsed).toEqual({ regDate: '2021-05-11', regAddr: 'Some addr' });
      expect(currentAnswersService.state).toEqual(
        JSON.stringify({ regDate: '2021-05-11', regAddr: 'Some addr' }),
      );
    });
  });

  describe('on data changed', () => {
    it('init with empty value', () => {
      const { fixture, component, currentAnswersService } = setup({
        ...mockData,
        value: null,
      });

      component.ngOnInit();
      fixture.detectChanges();

      expect(currentAnswersService.isValid).toBeFalsy();
    });

    it('init with some value', () => {
      const { component, currentAnswersService } = setup({
        ...mockData,
        value: JSON.stringify({ regAddr: 'Some addr', regDate: '11.05.2021' }),
      });

      component.ngOnInit();

      expect(currentAnswersService.isValid).toBeTruthy();
      expect(component.valueParsed.regAddr).toEqual('Some addr');
      expect(typeof component.valueParsed.regDate).toEqual('object');
      expect(JSON.parse(currentAnswersService.state as string)).toEqual({
        regAddr: 'Some addr',
        regDate: '11.05.2021',
      });
    });

    it('should not init field with value when it does not exists at fields', () => {
      const { component, currentAnswersService } = setup({
        ...mockData,
        attrs: {
          ...mockData.attrs,
          fields: [
            {
              fieldName: 'regAddr' as FieldNames,
              label: 'Адрес',
            },
          ],
        },
        value: JSON.stringify({ regAddr: 'Some addr', regDate: '11.05.2021' }),
      });

      component.ngOnInit();

      expect(currentAnswersService.isValid).toBeTruthy();
      expect(component.valueParsed).toEqual({ regAddr: 'Some addr' });
      expect(JSON.parse(currentAnswersService.state as string)).toEqual({ regAddr: 'Some addr' });
    });

    it('should show preset value over value if former is specified', () => {
      const { component, dateService } = setup({
        ...mockData,
        attrs: {
          ...mockData.attrs,
          fields: [
            {
              fieldName: 'regAddr' as FieldNames,
              label: 'Адрес',
            },
            {
              fieldName: 'regDate' as FieldNames,
              label: 'Дата',
            },
          ],
        },
        value: JSON.stringify({ regAddr: 'Some addr', regDate: '11.05.2021' }),
        presetValue: JSON.stringify({ regAddr: 'Some addr1', regDate: '12.05.2021' }),
      });

      component.ngOnInit();

      expect(component.valueParsed).toEqual({
        regAddr: 'Some addr1',
        regDate: dateService.parse('12.05.2021', DATE_STRING_DOT_FORMAT),
      });
    });
  });

  describe('render', () => {
    it('should render "empty-fields" block when state is invalid', () => {
      const { currentAnswersService, fixture } = setup();
      jest.spyOn(currentAnswersService, 'isValid$', 'get').mockReturnValue(of(false));

      fixture.detectChanges();

      const selector = '.empty-fields';
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });
  });
});
