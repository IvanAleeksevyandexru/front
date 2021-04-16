import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import { NavigationPayload } from '../../form-player/form-player.types';
import { CurrentAnswersService } from '../current-answers.service';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { ScreenTypes } from '../screen.types';
import { UniqueScreenComponent } from './unique-screen.component';
import { ComponentUniqueResolverComponent } from '../../component/unique-screen/component-unique-resolver/component-unique-resolver.component';
import { configureTestSuite } from 'ng-bullet';
import { ComponentDto } from 'epgu-constructor-types/dist/base/component-dto';
import { DisplayDto } from 'epgu-constructor-types/dist/base/screen';

const componentDtoSample: ComponentDto = {
  attrs: {},
  id: 'id1',
  type: 'type1',
  valueFromCache: false
};

const displayDtoSample: DisplayDto = {
  components: [],
  header: 'header1',
  id: 'id1',
  name: 'name1',
  submitLabel: 'submitLabel1',
  type: ScreenTypes.CUSTOM,
  terminal: true,
};

describe('UniqueScreenComponent', () => {
  let component: UniqueScreenComponent;
  let fixture: ComponentFixture<UniqueScreenComponent>;

  let navigationService: NavigationService;
  let screenService: ScreenService;
  let eventBusService: EventBusService;

  const initComponent = () => {
    fixture = TestBed.createComponent(UniqueScreenComponent);
    component = fixture.componentInstance;
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        UniqueScreenComponent,
        ComponentUniqueResolverComponent,
      ],
      providers: [
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        EventBusService,
        CurrentAnswersService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    navigationService = TestBed.inject(NavigationService);
    screenService = TestBed.inject(ScreenService);
    eventBusService = TestBed.inject(EventBusService);
    screenService.display = displayDtoSample;
    screenService.component = componentDtoSample;
    initComponent();
  });

  describe('nextDataForStep() method', () => {
    it('should call nextStep() method with payload object', () => {
      const nextStepSpy = spyOn(component, 'nextStep');

      screenService.component = componentDtoSample;

      component.nextDataForStep();

      expect(nextStepSpy).toBeCalledTimes(1);
      expect(nextStepSpy).toBeCalledWith({
        [componentDtoSample.id]: {
          visited: true,
          value: undefined,
        },
      });
      nextStepSpy.calls.reset();

      component.nextDataForStep('some value');

      expect(nextStepSpy).toBeCalledTimes(1);
      expect(nextStepSpy).toBeCalledWith({
        [componentDtoSample.id]: {
          visited: true,
          value: 'some value',
        },
      });
      nextStepSpy.calls.reset();
    });
  });

  describe('nextStep() method', () => {
    it('should call navigationService.next()', () => {
      const nextStepSpy = spyOn(navigationService, 'next');

      component.nextStep();

      expect(nextStepSpy).toBeCalledTimes(1);
      expect(nextStepSpy).toBeCalledWith({
        payload: undefined,
      });
      nextStepSpy.calls.reset();

      const navigationPayload: NavigationPayload = {
        foo: {
          visited: true,
          value: 'bar',
        },
      };

      component.nextStep(navigationPayload);
      expect(nextStepSpy).toBeCalledTimes(1);
      expect(nextStepSpy).toBeCalledWith({
        payload: navigationPayload,
      });
    });
  });
});
