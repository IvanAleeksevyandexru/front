import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ComponentBase } from '../../../../screen/screen.types';
import { ConfirmPersonalUserPhoneEmailComponent } from './confirm-personal-user-phone-email.component';
import { ActionDirective } from '../../../../shared/directives/action/action.directive';
import { UnsubscribeService, UnsubscribeServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { UniqueScreenComponentTypes } from '../../unique-screen-components.types';
import { configureTestSuite } from 'ng-bullet';
import { ActionType, ComponentActionDto } from '@epgu/epgu-constructor-types';
import { By } from '@angular/platform-browser';
import { ConfirmUserDataError } from '../confirm-personal-user-data-screen/confirm-personal-user-data-screen.types';
import { MockProvider } from 'ng-mocks';
import { FormatPhonePipe } from '@epgu/ui/pipes';

type PersonalUserPhoneEmailWithErrors = ComponentBase & {
  errors: ConfirmUserDataError[];
};

describe('ConfirmPersonalUserPhoneEmailComponent', () => {
  let component: ConfirmPersonalUserPhoneEmailComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserPhoneEmailComponent>;
  let screenService: ScreenService;
  let currentAnswersService: CurrentAnswersService;
  const mockData: PersonalUserPhoneEmailWithErrors = {
    attrs: {
      disclaimer: {
        type: 'warn',
        title: 'Нашли ошибку?',
        description:
          'Измените данные <a href=\'https://lk.gosuslugi.ru/settings/account\'>в личном кабинете</a>',
      },
      defaultHint: {
        type: 'warn',
        title: 'Добавьте телефон',
        value: 'Укажите ваш номер в профиле и продолжите заполнять заявление',
      },
    },
    id: '',
    label: '',
    type: '',
    value: '',
    errors: [],
  };
  const actionMock: ComponentActionDto = {
    label: '',
    value: '',
    action: null,
    type: ActionType.nextStep,
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ConfirmPersonalUserPhoneEmailComponent, FormatPhonePipe, ActionDirective],
      providers: [
        MockProvider(CurrentAnswersService),
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: UnsubscribeService, useClass: UnsubscribeServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserPhoneEmailComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    screenService.component = mockData;
    fixture.detectChanges();
    jest.spyOn(screenService, 'action', 'get').mockReturnValue(actionMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('updateValue()', () => {
    it('should update value', () => {
      component.updateValue('test@gmail.com', []);

      expect(currentAnswersService.isValid).toEqual(true);
      expect(currentAnswersService.state).toEqual('test@gmail.com');
    });

    it('shouldn\'t update value', () => {
      component.updateValue(null, []);

      expect(currentAnswersService.isValid).toEqual(false);
      expect(currentAnswersService.state).toEqual(undefined);
    });
  });

  describe('ngOnInit()', () => {
    it('should set initial state', () => {
      const updateValue = spyOn(component, 'updateValue');
      component.ngOnInit();
      expect(updateValue).toHaveBeenCalled();
    });

    it('should set isPhoneScreenType for confirmPersonalUserPhone', () => {
      jest
        .spyOn(screenService, 'component', 'get')
        .mockReturnValue({ type: UniqueScreenComponentTypes.confirmPersonalUserPhone } as any);
      component.ngOnInit();
      expect(component.isPhoneScreenType).toEqual(true);
    });

    it('should set isPhoneScreenType for confirmLegalPhone', () => {
      jest
        .spyOn(screenService, 'component', 'get')
        .mockReturnValue({ type: UniqueScreenComponentTypes.confirmLegalPhone } as any);
      component.ngOnInit();
      expect(component.isPhoneScreenType).toEqual(true);
    });

    it('should set isPhoneScreenType as false', () => {
      jest
        .spyOn(screenService, 'component', 'get')
        .mockReturnValue({ type: UniqueScreenComponentTypes.confirmPersonalUserEmail } as any);
      component.ngOnInit();
      expect(component.isPhoneScreenType).toEqual(false);
    });
  });

  it('should rendered correctly view state with errors', () => {
    mockData.errors = [
      {
        type: 'warn',
        title: 'Добавьте телефон.',
        desc: 'Укажите ваш номер в профиле и продолжите заполнять заявление',
      } as ConfirmUserDataError,
    ];
    screenService.component = mockData;
    fixture.detectChanges();

    const selector = 'epgu-constructor-disclaimer';
    const debugEl: DebugElement = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.nativeElement.type).toEqual('warn');
    expect(debugEl.nativeElement.description).toEqual(
      'Укажите ваш номер в профиле и продолжите заполнять заявление',
    );
  });

  it('should rendered correctly view state without errors', () => {
    mockData.errors = [];
    screenService.component = mockData;
    fixture.detectChanges();

    const selector = 'epgu-constructor-disclaimer';
    const debugEl: DebugElement = fixture.debugElement.query(By.css(selector));
    expect(debugEl.nativeElement.type).toEqual('warn');
    expect(debugEl.nativeElement.description).toEqual(
      'Измените данные <a href=\'https://lk.gosuslugi.ru/settings/account\'>в личном кабинете</a>',
    );
  });
});
