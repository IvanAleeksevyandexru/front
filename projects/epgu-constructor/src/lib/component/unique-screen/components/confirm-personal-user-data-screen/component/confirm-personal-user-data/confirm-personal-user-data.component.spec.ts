import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule, MockPipe, MockProvider } from 'ng-mocks';

import {
  ConfigService,
  DeviceDetectorService,
  DownloadService,
  EventBusService,
  LocalStorageService,
  LocationService,
  LocationServiceStub,
  ModalService,
  ModalServiceStub,
  SessionStorageService,
  SessionStorageServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { CurrentAnswersServiceStub } from '../../../../../../screen/current-answers-service.stub';
import { ConfirmUserDataErrorType } from '../../confirm-personal-user-data-screen.types';
import { ConfirmPersonalUserDataComponent } from './confirm-personal-user-data.component';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { OutputHtmlModule } from '../../../../../../shared/components/output-html/output-html.module';
import { DefaultUniqueScreenWrapperModule } from '../../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { BaseModule } from '../../../../../../shared/base.module';
import { FieldListModule } from '../../../../../../shared/components/field-list/field-list.module';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { ChangeDetectionStrategy, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActionDirective } from '../../../../../../shared/directives/action/action.directive';
import { configureTestSuite } from 'ng-bullet';
import {
  ActionType,
  ComponentActionDto,
  DTOActionAction,
  ScreenTypes,
} from '@epgu/epgu-constructor-types';
import { DisclaimerModule } from '../../../../../../shared/components/disclaimer/disclaimer.module';
import { ComponentBase, ScreenStoreComponentDtoI } from '../../../../../../screen/screen.types';
import { FormPlayerApiService } from '../../../../../../form-player/services/form-player-api/form-player-api.service';
import { NavigationService } from '../../../../../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../../../../../core/services/navigation/navigation.service.stub';
import { NavigationModalService } from '../../../../../../core/services/navigation-modal/navigation-modal.service';
import { HtmlRemoverService } from '../../../../../../shared/services/html-remover/html-remover.service';
import { AutocompleteApiService } from '../../../../../../core/services/autocomplete/autocomplete-api.service';
import { FormPlayerService } from '../../../../../../form-player/services/form-player/form-player.service';
import { FormPlayerServiceStub } from '../../../../../../form-player/services/form-player/form-player.service.stub';
import { JsonHelperService } from '../../../../../../core/services/json-helper/json-helper.service';
import { HtmlSelectService } from '../../../../../../core/services/html-select/html-select.service';
import { ConfirmPersonalUserDataPipe } from '../../confirm-personal-user-data.pipe';

const componentMock: ComponentBase = {
  attrs: {
    actions: [
      {
        label: '',
        value: '',
        action: DTOActionAction.getNextStep,
      },
    ],
    fields: [
      {
        fieldName: 'firstName',
        label: '',
        attrs: {
          validation: [
            {
              type: 'RegExp',
              value: '.+',
              ref: '',
              dataType: '',
              condition: '',
              errorMsg:
                'Для продолжения нужно заполнить поле <b>"Имя"</b> не может быть пустым. Нажмите кнопку "Редактировать".',
            },
            {
              type: 'RegExp',
              value: '^[\\s\\S]{0,60}$',
              ref: '',
              condition: '',
              errorMsg: 'Поле Имя должно содержать не более 60 символов',
            },
          ],
        },
      },
    ],
    customValidation: {
      fields: ['firstName'],
      path: 'storedValues',
    },
    style: {
      divider: '',
      list: '',
      field: '',
      group: '',
      groupTitle: '',
      label: '',
      value: '',
    },
  },
  type: '',
  value:
    '{"states":[{"groupName":"Фёдоров Фёдор Акакиевич", \
  "fields":[{"label":"Дата рождения","value":"06.06.1971"}]}, \
  {"groupName":"Паспорт гражданина РФ","fields":[{"label":"Серия и номер","value":"4410 271830"}, \
  {"label":"Дата выдачи","value":"08.07.2005"},{"label":"Кем выдан","value":"УФМС"},{"label":"Код подразделения","value":"490-001"}, \
  {"label":"Место рождения","value":"Россия"}]}], \
  "storedValues":{"firstName":"Фёдор","lastName":"Фёдоров","middleName":"Акакиевич","birthDate":"06.06.1971", \
  "birthPlace":"Россия","gender":"M","docType":"RF_PASSPORT","rfPasportSeries":"4410","rfPasportNumber":"271830", \
  "rfPasportIssueDate":"08.07.2005","rfPasportIssuedBy":"УФМС","rfPasportIssuedById":"490001", \
  "rfPasportIssuedByIdFormatted":"490-001","citizenship":"РОССИЯ","citizenshipCode":"RUS"},"errors":[]}',
  presetValue: '{}',
  label: '',
  id: 'id',
};
const actionMock = {
  label: '',
  value: '',
  action: '',
  type: ActionType.nextStep,
};

describe('ConfirmPersonalUserDataComponent', () => {
  let component: ConfirmPersonalUserDataComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserDataComponent>;
  let screenService: ScreenServiceStub;
  let currentAnswersService: CurrentAnswersService;
  let sessionStorageService: SessionStorageService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ConfirmPersonalUserDataComponent,
        MockPipe(ConfirmPersonalUserDataPipe, (value) => value),
      ],
      imports: [
        MockModule(OutputHtmlModule),
        MockModule(DefaultUniqueScreenWrapperModule),
        MockModule(BaseComponentsModule),
        MockModule(BaseModule),
        MockModule(FieldListModule),
        MockModule(ScreenPadModule),
        DisclaimerModule,
      ],
      providers: [
        { provide: CurrentAnswersService, useClass: CurrentAnswersServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: SessionStorageService, useClass: SessionStorageServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        MockProvider(FormPlayerApiService),
        MockProvider(DeviceDetectorService),
        MockProvider(NavigationModalService),
        MockProvider(DownloadService),
        MockProvider(LocalStorageService),
        MockProvider(HtmlRemoverService),
        MockProvider(AutocompleteApiService),
        MockProvider(EventBusService),
        MockProvider(JsonHelperService),
        MockProvider(HtmlSelectService),
      ],
    })
      .overrideComponent(ConfirmPersonalUserDataComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserDataComponent);
    component = fixture.componentInstance;
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    screenService.component = componentMock;
    jest.spyOn(screenService, 'action', 'get').mockReturnValue(actionMock as any);
    sessionStorageService = (TestBed.inject(
      SessionStorageService,
    ) as unknown) as SessionStorageServiceStub;
    screenService.getStore().errors = {};
  });

  it('should call ngDoCheck', () => {
    screenService.getStore().errors = {
      id: 'error',
    };
    spyOn(component, 'ngDoCheck').and.callThrough();
    fixture.detectChanges();
    expect(component.ngDoCheck).toHaveBeenCalled();
  });

  it('should set session param in ngOnInit', () => {
    screenService.cycledApplicantAnswerContext = {
      cycledApplicantAnswerItem: {
        id: '1',
      },
    };
    fixture.detectChanges();

    expect(sessionStorageService.getRaw('childId')).toBe('1');
  });

  it('should proccessed custom validation (required) for \'firstName\' and rendered correctly', () => {
    screenService.getStore().display = {
      components: [componentMock as ScreenStoreComponentDtoI],
      id: '',
      name: '',
      header: '',
      type: ScreenTypes.UNIQUE,
      terminal: false,
    };

    const value: { [key: string]: unknown } = JSON.parse(screenService.component.value) || {};

    // eslint-disable-next-line
    value[screenService.component.attrs.customValidation.path]['firstName'] = '';
    screenService.component.value = JSON.stringify(value);
    fixture.detectChanges();

    expect(JSON.stringify(component.errors)).toEqual(
      JSON.stringify([
        {
          type: 'error',
          title: 'Ошибка',
          desc:
            'Для продолжения нужно заполнить поле <b>"Имя"</b> не может быть пустым. Нажмите кнопку "Редактировать".',
        },
      ]),
    );

    const selector = 'epgu-constructor-disclaimer';
    const debugEl: DebugElement = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();
  });

  it('should proccessed custom validation (maxLength) for \'firstName\' and rendered correctly', () => {
    screenService.getStore().display = {
      components: [componentMock as ScreenStoreComponentDtoI],
      id: '',
      name: '',
      header: '',
      type: ScreenTypes.UNIQUE,
      terminal: false,
    };

    const value: { [key: string]: unknown } = JSON.parse(screenService.component.value) || {};

    // eslint-disable-next-line
    value[screenService.component.attrs.customValidation.path]['firstName'] = ''.padStart(61, '*');
    screenService.component.value = JSON.stringify(value);
    fixture.detectChanges();

    expect(JSON.stringify(component.errors)).toEqual(
      JSON.stringify([
        {
          type: 'error',
          title: 'Ошибка',
          desc: 'Поле Имя должно содержать не более 60 символов',
        },
      ]),
    );

    const selector = 'epgu-constructor-disclaimer';
    const debugEl: DebugElement = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();
  });

  describe('update value', () => {
    it('currentAnswersService.state should be component.value', () => {
      screenService.component = {
        ...componentMock,
        value: '{"foo": "bar"}',
      };
      fixture.detectChanges();

      expect(currentAnswersService.state).toBe('{"foo": "bar"}');
    });

    it('should update currentAnswersService.isValid should be TRUE if has ConfirmUserDataErrorType error in component.value', () => {
      // потому что component.value еще не определен
      expect(currentAnswersService.isValid).toBeFalsy();

      screenService.component = {
        ...componentMock,
        value: '{"foo": "bar"}',
      };
      fixture.detectChanges();

      // потому что в component.value нет массива errors
      expect(currentAnswersService.isValid).toBeTruthy();

      screenService.component = {
        ...componentMock,
        value: JSON.stringify({
          errors: [
            {
              type: 'someType',
            },
          ],
        }),
      };
      fixture.detectChanges();

      // потому что в массиве errors нет ошибки с типом ConfirmUserDataErrorType
      expect(currentAnswersService.isValid).toBeTruthy();

      screenService.component = {
        ...componentMock,
        value: JSON.stringify({
          errors: [
            {
              type: ConfirmUserDataErrorType.error,
            },
          ],
        }),
      };
      fixture.detectChanges();

      expect(currentAnswersService.isValid).toBeFalsy();
    });
  });

  it('should render epgu-constructor-default-unique-screen-wrapper', () => {
    const selector = 'epgu-constructor-default-unique-screen-wrapper';

    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.header).toBeUndefined();
    expect(debugEl.componentInstance.isLoading).toBeFalsy();
    expect(debugEl.componentInstance.screenActionButtons).toBeUndefined();
    expect(debugEl.componentInstance.actionButtons).toBeUndefined();
    expect(debugEl.componentInstance.isShowActionBtn).toBeFalsy();
    expect(debugEl.componentInstance.showNav).toBeFalsy();
    expect(debugEl.componentInstance.isValid).toBeFalsy();

    screenService.header = 'some header';
    screenService.isLoadingSubject.next(true);
    screenService.buttons = [
      {
        label: 'some screen action label',
      },
    ] as ComponentActionDto[];
    screenService.actions = [
      {
        label: 'some action label',
      },
    ] as ComponentActionDto[];

    const buttons = [{ label: 'some submit label', action: DTOActionAction.getNextStep }];

    screenService.showNav = true;
    screenService.buttons = buttons;
    currentAnswersService.isValid = true;
    fixture.detectChanges();

    expect(debugEl.componentInstance.header).toBe('some header');
    expect(debugEl.componentInstance.isLoading).toBeTruthy();
    expect(debugEl.componentInstance.screenButtons).toEqual(buttons);
    expect(debugEl.componentInstance.showNav).toBeTruthy();
    expect(debugEl.componentInstance.isValid).toBeTruthy();
  });

  it('should render epgu-cf-ui-constructor-screen-pad', () => {
    const selector =
      'epgu-constructor-default-unique-screen-wrapper epgu-cf-ui-constructor-screen-pad';

    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();
  });

  it('should render epgu-constructor-field-list', () => {
    const selector = 'epgu-constructor-default-unique-screen-wrapper epgu-constructor-field-list';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.component = componentMock;
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.data).toBe(componentMock);
  });

  it('should render action button if type is ActionType.profileEdit', () => {
    const selector = 'epgu-constructor-default-unique-screen-wrapper [epgu-constructor-action]';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    const actionSample = {
      label: 'some screen action label',
      type: ActionType.profileEdit,
    } as ComponentActionDto;

    screenService.action = actionSample;
    jest.spyOn(screenService, 'action', 'get').mockReturnValue(actionSample);
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();
    expect(debugEl.injector.get(ActionDirective).action).toBe(actionSample);
  });
});
