import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponents, MockModule } from 'ng-mocks';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { configureTestSuite } from 'ng-bullet';

import {
  ScreenContainerComponent,
  ScreenPadModule,
  PrevButtonComponent,
  EventBusService,
  UnsubscribeService,
  LocalStorageService,
  LocalStorageServiceStub,
  ModalService,
  ModalServiceStub
} from '@epgu/epgu-constructor-ui-kit';
import { DisplayDto, ScreenTypes } from '@epgu/epgu-constructor-types';
import { CurrentAnswersService } from '../current-answers.service';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { RepeatableScreenComponent } from './repeatable-screen.component';
import { BaseModule } from '../../shared/base.module';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { ComponentsListComponent } from '../../component/custom-screen/components-list.component';
import { CloneButtonComponent } from '../../shared/components/clone-button/clone-button.component';
import { FormPlayerApiService } from '../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../../form-player/services/form-player-api/form-player-api.service.stub';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import { ActionService } from '../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../shared/directives/action/action.service.stub';
import { ScreenButtonsModule } from '../../shared/components/screen-buttons/screen-buttons.module';
import { CachedAnswersService } from '../../shared/services/cached-answers/cached-answers.service';
import { CustomComponent } from '../../component/custom-screen/components-list.types';
import { UniquenessErrorsService } from '../../shared/services/uniqueness-errors/uniqueness-errors.service';
import { ComponentsListFormService } from '../../component/custom-screen/services/components-list-form/components-list-form.service';
import { UserInfoLoaderModule } from '../../shared/components/user-info-loader/user-info-loader.module';
import { JsonHelperService } from '../../core/services/json-helper/json-helper.service';

const displayMock = {
  id: 's113',
  name: 'Укажите все изменения ФИО',
  type: ScreenTypes.REPEATABLE,
  header: 'Укажите все изменения',
  submitLabel: 'Далее',
  components: [
    {
      id: 'pd6',
      type: 'RepeatableFields',
      label: 'Добавить еще  ФИО',
      attrs: {
        repeatableComponents: [
          [
            {
              id: 'pd8_1',
              type: 'Lookup',
              label: 'Прежний регион',
              attrs: { dictionaryType: 'regions_56555' },
              value: '',
              required: true,
              suggestionId: 'prev_region',
            }
          ],
        ],
        repeatAmount: '20',
        components: [
          {
            id: 'pd9',
            type: 'StringInput',
            label: 'Прежняя фамилия',
            attrs: {
              fstuc: 'all',
              validation: [
                {
                  type: 'RegExp',
                  value: '.+',
                  ref: '',
                  dataType: '',
                  condition: '',
                  errorMsg: 'Поле не может быть пустым',
                },
                {
                  type: 'RegExp',
                  value: '^[\\s\\S]{0,100}$',
                  ref: '',
                  condition: '',
                  errorMsg: 'Поле должно содержать не более 100 символов',
                },
              ],
            },
            value: '',
            required: true,
            cycled: false,
          },
          {
            id: 'pd10',
            type: 'StringInput',
            label: 'Прежнее имя',
            attrs: {
              fstuc: 'all',
              validation: [
                {
                  type: 'RegExp',
                  value: '^[\\s\\S]{0,100}$',
                  ref: '',
                  condition: '',
                  errorMsg: 'Поле должно содержать не более 100 символов',
                },
              ],
            },
            value: '',
            required: false,
            cycled: false,
          },
          {
            id: 'pd11',
            type: 'StringInput',
            label: 'Прежнее отчество',
            attrs: {
              fstuc: 'all',
              validation: [
                {
                  type: 'RegExp',
                  value: '^[\\s\\S]{0,100}$',
                  ref: '',
                  condition: '',
                  errorMsg: 'Поле должно содержать не более 100 символов',
                },
              ],
              customUnrecLabel: 'При наличии',
              onlyFirstScreen: true,
            },
            value: '',
            required: false,
            cycled: false,
          },
        ],
        fields: [],
        actions: [],
      },
      arguments: {},
      value: '',
      required: true,
      cycled: false,
    },
  ],
  accepted: true,
  impasse: false,
  terminal: false,
  firstScreen: false,
} as unknown as DisplayDto;

describe('RepeatableScreenComponent', () => {
  let component: RepeatableScreenComponent;
  let fixture: ComponentFixture<RepeatableScreenComponent>;

  let eventBusService: EventBusService;
  let screenService: ScreenService;
  let navigationService: NavigationService;
  let cachedAnswersService: CachedAnswersService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MockModule(BaseModule),
        BaseComponentsModule,
        ScreenPadModule,
        ScreenButtonsModule,
        MockModule(UserInfoLoaderModule),
      ],
      declarations: [
        RepeatableScreenComponent,
        ScreenContainerComponent,
        MockComponents(ComponentsListComponent, CloneButtonComponent, PrevButtonComponent),
      ],
      providers: [
        CurrentAnswersService,
        ChangeDetectorRef,
        ScrollToService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        UnsubscribeService,
        EventBusService,
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        CachedAnswersService,
        UniquenessErrorsService,
        ComponentsListFormService,
        JsonHelperService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    screenService.display = displayMock;
    eventBusService = TestBed.inject(EventBusService);
    navigationService = TestBed.inject(NavigationService);
    cachedAnswersService = TestBed.inject(CachedAnswersService);
    fixture = TestBed.createComponent(RepeatableScreenComponent);
    component = fixture.componentInstance;
    screenService.buttons = [];
    fixture.detectChanges();
  });

  describe('addSectionLabel$', () => {
    it('should return custom label when component has label', (done) => {
      const label = 'Some custom label';
      screenService.componentLabel = label;
      component.addSectionLabel$.subscribe((resultLabel) => {
        expect(resultLabel).toBe(label);
        done();
      });
    });

    it('should return default label when component hasn\'t label', (done) => {
      const label = 'Добавить данные';
      component.addSectionLabel$.subscribe((resultLabel) => {
        expect(resultLabel).toBe(label);
        done();
      });
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

  it('when cloneButtonClickEvent,should create components with filtered onlyFirstScreen', () => {
    const components = [
      displayMock.components[0].attrs.components[0],
      displayMock.components[0].attrs.components[1],
    ];
    const setNewScreenSpy = spyOn<any>(component, 'setNewScreen');
    eventBusService.emit('cloneButtonClickEvent', 'any');
    expect(setNewScreenSpy).toBeCalledTimes(1);
    expect(setNewScreenSpy).toBeCalledWith(components, undefined);
  });

  it('should been called setNewScreen method with screens components', () => {
    const setNewScreenSpy = spyOn<any>(component, 'setNewScreen');
    const { components } = displayMock.components[0].attrs;
    component.init$.subscribe(() => {
      expect(setNewScreenSpy).toBeCalledTimes(1);
      expect(setNewScreenSpy).toBeCalledWith(components);
    });
  });

  it('should call setNewScreen twice if minOccures = 2', () => {
    const displayMockWithMinOccures = { ...displayMock };
    displayMockWithMinOccures.components[0].attrs.minOccures = 2;
    screenService.display = displayMockWithMinOccures;
    const createScreenSpy = spyOn<any>(component, 'createScreen').and.callFake(jest.fn());

    component.init$.subscribe();
    expect(createScreenSpy).toBeCalledTimes(2);
  });

  describe('isScreensAvailable', () => {
    const setup = (repeatAmount: number, screensCount: number = 0) => {
      const displayMockWithMinRepeatAmount = { ...displayMock };
      displayMockWithMinRepeatAmount.components[0].attrs.repeatAmount = repeatAmount;
      screenService.display = displayMockWithMinRepeatAmount;
      spyOn<any>(component, 'createScreen').and.callFake(jest.fn());

      const screens: { [key: string]: CustomComponent[] } = {};
      for (let i = 0; i < screensCount; i += 1) {
        screens[`custom${i}`] = [{} as CustomComponent];
      }

      component.screens = screens;
      fixture.detectChanges();
    };

    it('should be true when repeatAmount is bigger than screens count', () => {
      setup(5, 2);
      expect(component.isScreensAvailable()).toBeTruthy();
    });

    it('should not allow to add new copy when repeatAmount is equal screens count', () => {
      setup(5, 5);
      expect(component.isScreensAvailable()).toBeFalsy();
    });

    it('should not allow to add new copy when repeatAmount is equal screens count', () => {
      setup(5, 6);
      expect(component.isScreensAvailable()).toBeFalsy();
    });

    it('should not allow to add new copy when repeatAmount is less or equal than screens count and bigger than default value', () => {
      setup(25, 22);
      expect(component.isScreensAvailable()).toBeTruthy();
    });
  });

  describe('cachedValues', () => {
    it('should be removed on navigation', () => {
      jest.spyOn(cachedAnswersService, 'removeValueFromLocalStorage');
      navigationService.next(null);
      expect(cachedAnswersService.removeValueFromLocalStorage).toHaveBeenCalled();
    });

    describe('if cacheRepeatableFieldsAnswersLocally is TRUE', () => {
      const displayMockCacheEnable = { ...displayMock };

      it('should add values to cache on change', () => {
        displayMockCacheEnable.components[0].attrs.cacheRepeatableFieldsAnswersLocally = true;
        screenService.display = displayMockCacheEnable;
        component.ngOnInit();

        expect(component.cacheRepeatableFieldsAnswersLocally).toBeTruthy();

        jest.spyOn(cachedAnswersService, 'setValueToLocalStorage');
        component.changeComponentList({
          pd9: { value: 'Имя', valid: true }
        }, 0);

        expect(cachedAnswersService.setValueToLocalStorage).toHaveBeenCalled();
      });

      it('should add values to cache on remove item', () => {
        displayMockCacheEnable.components[0].attrs.cacheRepeatableFieldsAnswersLocally = true;
        screenService.display = displayMockCacheEnable;
        component.ngOnInit();

        expect(component.cacheRepeatableFieldsAnswersLocally).toBeTruthy();

        jest.spyOn(cachedAnswersService, 'setValueToLocalStorage');
        component.removeItem('pd9', 0);

        expect(cachedAnswersService.setValueToLocalStorage).toHaveBeenCalled();
      });
    });

    describe('if cacheRepeatableFieldsAnswersLocally is FALSE', () => {
      const displayMockCacheDisable = { ...displayMock };

      it('should not add values to cache on change', () => {
        displayMockCacheDisable.components[0].attrs.cacheRepeatableFieldsAnswersLocally = false;
        screenService.display = displayMockCacheDisable;
        component.ngOnInit();

        expect(component.cacheRepeatableFieldsAnswersLocally).toBeFalsy();

        jest.spyOn(cachedAnswersService, 'setValueToLocalStorage');
        component.changeComponentList({
          pd9: { value: 'Имя', valid: true }
        }, 0);

        expect(cachedAnswersService.setValueToLocalStorage).not.toHaveBeenCalled();
      });

      it('should not add values to cache on remove item', () => {
        displayMockCacheDisable.components[0].attrs.cacheRepeatableFieldsAnswersLocally = false;
        screenService.display = displayMockCacheDisable;
        component.ngOnInit();

        expect(component.cacheRepeatableFieldsAnswersLocally).toBeFalsy();

        jest.spyOn(cachedAnswersService, 'setValueToLocalStorage');
        component.removeItem('pd9', 0);

        expect(cachedAnswersService.setValueToLocalStorage).not.toHaveBeenCalled();
      });
    });
  });
});
