import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import { CurrentAnswersService } from '../current-answers.service';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { UniqueScreenComponent } from './unique-screen.component';
import { ComponentUniqueResolverComponent } from '../../component/unique-screen/component-unique-resolver/component-unique-resolver.component';
import { ComponentDto, DisplayDto, ScreenTypes, NavigationPayload } from '@epgu/epgu-constructor-types';

const componentDtoSample: ComponentDto = {
  attrs: {},
  id: 'id1',
  type: 'type1',
  valueFromCache: false,
};

const displayDtoSample: DisplayDto = {
  components: [],
  header: 'header1',
  id: 'id1',
  name: 'name1',
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UniqueScreenComponent, ComponentUniqueResolverComponent],
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
      const nextStepSpy = jest.spyOn(component, 'nextStep');

      screenService.component = componentDtoSample;

      component.nextDataForStep();

      expect(nextStepSpy).toBeCalledTimes(1);
      expect(nextStepSpy).toBeCalledWith({
        [componentDtoSample.id]: {
          visited: true,
          value: undefined,
        },
      });
      nextStepSpy.mockReset();

      component.nextDataForStep('some value');

      expect(nextStepSpy).toBeCalledTimes(1);
      expect(nextStepSpy).toBeCalledWith({
        [componentDtoSample.id]: {
          visited: true,
          value: 'some value',
        },
      });
    });
  });

  describe('nextStep() method', () => {
    it('should call navigationService.next()', () => {
      const nextStepSpy = jest.spyOn(navigationService, 'next');

      component.nextStep();

      expect(nextStepSpy).toBeCalledTimes(1);
      expect(nextStepSpy).toBeCalledWith({
        payload: undefined,
      });
      nextStepSpy.mockReset();

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
