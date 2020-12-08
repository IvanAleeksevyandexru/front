import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../core/config/config.service';
import { DeviceDetectorService } from '../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../core/services/device-detector/device-detector.service.stub';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { FormPlayerApiService } from '../../form-player/services/form-player-api/form-player-api.service';
import { ServiceDataService } from '../../form-player/services/service-data/service-data.service';
import { CachedAnswersService } from '../../shared/services/applicant-answers/cached-answers.service';
import { UtilsService } from '../../shared/services/utils/utils.service';
import { CurrentAnswersService } from '../current-answers.service';
import { ScreenService } from '../screen.service';
import { ScreenStore, ScreenTypes } from '../screen.types';
import { CycledFieldsService } from '../services/cycled-fields/cycled-fields.service';
import { InfoScreenComponent } from './info-screen.component';


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
        UtilsService,
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
