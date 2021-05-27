import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import { CurrentAnswersService } from '../current-answers.service';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { SpaScreenComponent } from './spa-screen.component';
import { ComponentUniqueResolverComponent } from '../../component/unique-screen/component-unique-resolver/component-unique-resolver.component';
import { configureTestSuite } from 'ng-bullet';
import { ComponentDto, DisplayDto, ScreenTypes } from '@epgu/epgu-constructor-types';
import { CfSpaStateService, CfSpaStateServiceStub, LocationService, LocationServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ConfigService } from '../../core/services/config/config.service';
import { ConfigServiceStub } from '../../core/services/config/config.service.stub';

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
  type: ScreenTypes.SPA,
  terminal: true,
};

describe('SpaScreenComponent', () => {
  let component: SpaScreenComponent;
  let fixture: ComponentFixture<SpaScreenComponent>;

  let navigationService: NavigationService;
  let screenService: ScreenService;
  let eventBusService: EventBusService;

  const initComponent = () => {
    fixture = TestBed.createComponent(SpaScreenComponent);
    component = fixture.componentInstance;
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        SpaScreenComponent,
        ComponentUniqueResolverComponent,
      ],
      providers: [
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: CfSpaStateService, useClass: CfSpaStateServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
