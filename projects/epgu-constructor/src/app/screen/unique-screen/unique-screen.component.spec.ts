import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../core/config/config.service';
import { ConfigServiceStub } from '../../core/config/config.service.stub';
import { DeviceDetectorService } from '../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../core/services/device-detector/device-detector.service.stub';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { CachedAnswersService } from '../../shared/services/applicant-answers/cached-answers.service';
import { UtilsService } from '../../shared/services/utils/utils.service';
import { CurrentAnswersService } from '../current-answers.service';
import { ScreenService } from '../screen.service';
import { ScreenStore, ScreenTypes } from '../screen.types';
import { CycledFieldsService } from '../services/cycled-fields/cycled-fields.service';
import { UniqueScreenComponent } from './unique-screen.component';

describe('UniqueScreenComponent', () => {
  let component: UniqueScreenComponent;
  let fixture: ComponentFixture<UniqueScreenComponent>;
  let navService: NavigationService;
  let screenService: ScreenService;
  const screenDataMock: ScreenStore = {
    display: {
      components: [
        {
          attrs: {},
          type: '',
          id: '',
          label: '',
          value: ''
        }
      ],
      header: '',
      id: '',
      name: '',
      submitLabel: '',
      terminal: false,
      type: ScreenTypes.COMPONENT
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ UniqueScreenComponent ],
      providers: [
        NavigationService,
        ScreenService,
        UnsubscribeService,
        CachedAnswersService,
        CurrentAnswersService,
        CycledFieldsService,
        UtilsService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
      ]
    })
    .compileComponents();
    navService = TestBed.inject(NavigationService);
    screenService = TestBed.inject(ScreenService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniqueScreenComponent);
    component = fixture.componentInstance;
    screenService.updateScreenStore(screenDataMock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
