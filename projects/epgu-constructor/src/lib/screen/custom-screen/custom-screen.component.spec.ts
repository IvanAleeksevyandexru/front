import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent, MockModule } from 'ng-mocks';
import { ComponentsListComponent } from '../../component/custom-screen/components-list.component';
import {
  CustomComponentOutputData,
  CustomComponentValidationConditions,
} from '../../component/custom-screen/components-list.types';
import {
  LoggerService,
  ConfigService,
  ModalService,
  ModalServiceStub,
  ScreenPadComponent,
  DatesToolsService,
  EventBusService,
} from '@epgu/epgu-constructor-ui-kit';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import { PageNameComponent } from '../../shared/components/base-components/page-name/page-name.component';
import { ScreenContainerComponent } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../current-answers.service';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { CustomScreenComponent } from './custom-screen.component';
import { CustomScreenService } from './custom-screen.service';
import { UserInfoLoaderModule } from '../../shared/components/user-info-loader/user-info-loader.module';
import { BaseModule } from '../../shared/base.module';
import { ScreenButtonsModule } from '../../shared/components/screen-buttons/screen-buttons.module';
import { ActionService } from '../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../shared/directives/action/action.service.stub';
import {
  ComponentDto,
  ActionType,
  DTOActionAction,
  ScreenTypes,
  DisplayDto
} from '@epgu/epgu-constructor-types';
import { EaisdoGroupCostService } from '../../shared/services/eaisdo-group-cost/eaisdo-group-cost.service';
import { CertificateEaisdoService } from '../../shared/services/certificate-eaisdo/certificate-eaisdo.service';
import { HttpClientModule } from '@angular/common/http';

describe('CustomScreenComponent', () => {
  let component: CustomScreenComponent;
  let fixture: ComponentFixture<CustomScreenComponent>;

  let screenService: ScreenServiceStub;
  let customScreenService: CustomScreenService;
  let datesToolsService: DatesToolsService;
  let components = [
    {
      id: 'bd01',
      type: 'LabelSection',
      label: 'Нажимая “Отправить заявление”, вы соглашаетесь с правилами предоставления услуги',
      attrs: {
        isTextHelper: true,
        isBottomSlot: true,
      },
      value: '',
      visited: false,
    },
    {
      id: 'bd1',
      type: 'LabelSection',
      label: 'Нажимая “Отправить заявление”, вы соглашаетесь с правилами предоставления услуги',
      attrs: {
        // @ts-ignore
        isTextHelper: true,
      },
      value: '',
      visited: false,
    },
  ] as ComponentDto[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MockModule(UserInfoLoaderModule),
        BaseModule,
        ScreenButtonsModule,
        HttpClientModule,
      ],
      declarations: [
        CustomScreenComponent,
        MockComponent(PageNameComponent),
        MockComponent(ComponentsListComponent),
        MockComponent(ScreenPadComponent),
        MockComponent(ScreenContainerComponent),
      ],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        EventBusService,
        CurrentAnswersService,
        CertificateEaisdoService,
        CustomScreenService,
        DatesToolsService,
        ConfigService,
        LoggerService,
        EaisdoGroupCostService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(CustomScreenComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomScreenComponent);
    component = fixture.componentInstance;
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    customScreenService = TestBed.inject(CustomScreenService);
    datesToolsService = TestBed.inject(DatesToolsService);
    screenService.buttons = [];
    screenService.display = {
      components,
      header: 'header1',
      id: 'id1',
      name: 'name1',
      type: ScreenTypes.CUSTOM,
      terminal: true,
    } as DisplayDto;

    component.ngOnInit();
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    it('should call setHelperText()', () => {
      const spy = jest.spyOn<any, string>(component, 'setHelperText');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('setHelperText()', () => {
    it('should mutate initial components list length, if there is LabelSection with specific attrs among them', () => {
      expect(screenService.display.components.length).toBe(1);
    });
  });

  describe('dataToSend property', () => {
    it('should be undefined by default', () => {
      expect(component.dataToSend).toBeUndefined();
    });
  });

  describe('isValid property', () => {
    it('should be undefined by default', () => {
      expect(component.isValid).toBeUndefined();
    });
  });

  describe('getFormattedData() method', () => {
    it('without data', () => {
      const date = new Date();
      const changes: CustomComponentOutputData = {
        any: {
          value: datesToolsService.format(date),
          valid: true,
        },
      };
      const expectedResult = {
        any: { visited: true, disabled: undefined, value: datesToolsService.format(date) },
      };

      const result = customScreenService.getFormattedData(changes);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('changeComponentList() method', () => {
    // @todo. fix type
    const expectedDataSend: CustomComponentOutputData = ({
      any: {
        value: 'any',
        visited: true,
        disabled: undefined,
      },
    } as unknown) as CustomComponentOutputData;

    it('condition === atLeastOne', () => {
      // @todo. fix type
      const changes: CustomComponentOutputData = ({
        any: {
          condition: CustomComponentValidationConditions.atLeastOne,
          isValid: true,
          value: 'any',
        },
      } as unknown) as CustomComponentOutputData;

      component.changeComponentsList(changes);

      expect(component.isValid).toBeTruthy();
      expect(component.dataToSend).toEqual(expectedDataSend);
    });

    it('condition !== atLeastOne', () => {
      // @todo. fix type
      const changes: CustomComponentOutputData = ({
        any: {
          condition: 'any',
          isValid: false,
          value: 'any',
        },
      } as unknown) as CustomComponentOutputData;

      component.changeComponentsList(changes);

      expect(component.isValid).toBeFalsy();
      expect(component.dataToSend).toEqual(expectedDataSend);
    });
  });

  describe('epgu-cf-ui-screen-container', () => {
    const selector = 'epgu-cf-ui-screen-container';

    it('should be rendered', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('showNav property should be TRUE if screenService.showNav is TRUE, otherwise should be FALSE', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.showNav).toBeFalsy();

      screenService.showNav = false;
      fixture.detectChanges();

      expect(debugEl.componentInstance.showNav).toBeFalsy();

      screenService.showNav = true;
      fixture.detectChanges();

      expect(debugEl.componentInstance.showNav).toBeTruthy();
    });
  });

  it('should render epgu-constructor-page-name', () => {
    const selector = 'epgu-cf-ui-screen-container epgu-constructor-page-name';

    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();
  });

  it('should render epgu-cf-ui-constructor-screen-pad', () => {
    const selector = 'epgu-cf-ui-screen-container epgu-cf-ui-constructor-screen-pad';

    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();
  });

  it('should render epgu-constructor-components-list', () => {
    const selector =
      'epgu-cf-ui-screen-container epgu-cf-ui-constructor-screen-pad epgu-constructor-components-list';

    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();
    expect(debugEl.componentInstance.errors).toBeNull();

    const components: ComponentDto[] = [
      {
        attrs: {},
        id: 'id1',
        type: 'type1',
      },
    ];
    screenService.display = {
      components,
      header: 'header1',
      id: 'id1',
      name: 'name1',
      type: ScreenTypes.CUSTOM,
      terminal: true,
    };

    const componentErrors = (screenService.componentErrors = {
      foo: 'bar',
    });

    fixture.detectChanges();

    expect(debugEl.componentInstance.components).toBe(components);
    expect(debugEl.componentInstance.errors).toBe(componentErrors);
  });

  it('should call changeComponentsList() on epgu-constructor-components-list changes() event', () => {
    const selector =
      'epgu-cf-ui-screen-container epgu-cf-ui-constructor-screen-pad epgu-constructor-components-list';

    const debugEl = fixture.debugElement.query(By.css(selector));

    const date = new Date();
    const changesData: CustomComponentOutputData = {
      any: {
        value: date.toISOString(),
        valid: true,
      },
    };

    const changeComponentsListSpy = jest.spyOn(component, 'changeComponentsList');

    debugEl.triggerEventHandler('changes', changesData);

    expect(changeComponentsListSpy).toBeCalledTimes(1);
    expect(changeComponentsListSpy).toBeCalledWith(changesData);
  });

  describe('Submit button', () => {
    const selector = 'epgu-cf-ui-screen-container lib-button';

    it('should be rendered if has buttons', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeNull();

      screenService.buttons = [
        {
          label: 'any',
          action: DTOActionAction.getNextStep,
          type: ActionType.nextStep,
        },
      ];
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('disabled property should be TRUE if screenService.isLoading is TRUE or isValid is FALSE', () => {
      screenService.buttons = [
        {
          label: 'any',
          action: DTOActionAction.getNextStep,
          type: ActionType.nextStep,
        },
      ];

      screenService.isLoadingSubject.next(true);
      component.isValid = false;

      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.disabled).toBeTruthy();

      screenService.isLoadingSubject.next(false);
      fixture.detectChanges();

      expect(debugEl.componentInstance.disabled).toBeTruthy();

      component.isValid = true;
      fixture.detectChanges();

      expect(debugEl.componentInstance.disabled).toBeFalsy();
    });
  });
});
