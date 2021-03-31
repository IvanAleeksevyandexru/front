import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { DisplayDto } from '../../form-player/services/form-player-api/form-player-api.types';
import { CurrentAnswersService } from '../current-answers.service';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { ScreenTypes } from '../screen.types';
import { ScreenContainerComponent } from '../../shared/components/screen-container/screen-container.component';
import { RepeatableScreenComponent } from './repeatable-screen.component';

const displayMock = {
  id: 's113',
  name: 'Укажите все изменения ФИО',
  type: ScreenTypes.UNIQUE,
  header: 'Укажите все изменения',
  submitLabel: 'Далее',
  components: [
    {
      id: 'pd6',
      type: 'RepeatableFields',
      label: 'Добавить еще  ФИО',
      attrs: {
        repeatableComponents: [],
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
              onlyFirstScreen: true
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
} as DisplayDto;

describe('RepeatableScreenComponent', () => {
  let component: RepeatableScreenComponent;
  let fixture: ComponentFixture<RepeatableScreenComponent>;

  let eventBusService: EventBusService;
  let screenService: ScreenService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
        declarations: [RepeatableScreenComponent, MockComponent(ScreenContainerComponent)],
        providers: [
          CurrentAnswersService,
          ChangeDetectorRef,
          { provide: ScreenService, useClass: ScreenServiceStub },
          EventBusService,
        ],
      }).compileComponents();
      screenService = TestBed.inject(ScreenService);
      screenService.display = displayMock;
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatableScreenComponent);
    eventBusService = TestBed.inject(EventBusService);
    component = fixture.componentInstance;
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

  describe('epgu-constructor-screen-container', () => {
    const selector = 'epgu-constructor-screen-container';

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
      displayMock.components[0].attrs.components[1]
    ];
    const setNewScreenSpy = spyOn<any>(component, 'setNewScreen');
    eventBusService.emit('cloneButtonClickEvent', 'any');
    expect(setNewScreenSpy).toBeCalledTimes(1);
    expect(setNewScreenSpy).toBeCalledWith(components);

  });

  it('should been called setNewScreen method with screens components',  () => {
    const setNewScreenSpy = spyOn<any>(component, 'setNewScreen');
    const { components } = displayMock.components[0].attrs;
    component.init$.subscribe(() => {
      expect(setNewScreenSpy).toBeCalledTimes(1);
      expect(setNewScreenSpy).toBeCalledWith(components);
    });
  });
});
