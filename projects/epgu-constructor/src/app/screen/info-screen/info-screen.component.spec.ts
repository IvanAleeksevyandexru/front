import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { InfoScreenComponent } from './info-screen.component';
import { ScreenService } from '../screen.service';
import { ScreenStore, ScreenTypes } from '../screen.types';
import { CachedAnswersService } from '../../shared/services/applicant-answers/cached-answers.service';
import { CurrentAnswersService } from '../current-answers.service';
import { FormPlayerApiService } from '../../services/form-player-api/form-player-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';
import { ServiceDataService } from '../../services/service-data/service-data.service';
import { CycledFieldsService } from '../services/cycled-fields/cycled-fields.service';
import { DeviceDetectorService } from '../../shared/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../shared/services/device-detector/device-detector.service.stub';


describe('InfoScreenComponent', () => {
  let component: InfoScreenComponent;
  let fixture: ComponentFixture<InfoScreenComponent>;
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
      imports: [
        HttpClientTestingModule
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ InfoScreenComponent ],
      providers: [
        NavigationService,
        UnsubscribeService,
        ScreenService,
        CachedAnswersService,
        CurrentAnswersService,
        FormPlayerApiService,
        ConfigService,
        ServiceDataService,
        CycledFieldsService,
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoScreenComponent);
    component = fixture.componentInstance;
    screenService = fixture.debugElement.injector.get(ScreenService);
    screenService.updateScreenStore(screenDataMock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
