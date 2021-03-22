import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DeviceDetectorServiceStub } from '../../../core/services/device-detector/device-detector.service.stub';
import { DeviceDetectorService } from '../../../core/services/device-detector/device-detector.service';
import { DropdownListModalComponent } from './dropdown-list-modal.component';
import { DropdownListComponent } from './dropdown-list/dropdown-list.component';
import { FilterPipe } from '../pipes/filter.pipe';
import { BaseModule } from '../../../shared/base.module';
import { ConfirmationModalModule } from '../../confirmation-modal/confirmation-modal.module';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { InitDataService } from '../../../core/services/init-data/init-data.service';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { ConfigService } from '../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../core/services/config/config.service.stub';
import { LocationServiceStub } from '../../../core/services/location/location.service.stub';
import { LocationService } from '../../../core/services/location/location.service';
import { NavigationServiceStub } from '../../../core/services/navigation/navigation.service.stub';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { NavigationModalService } from '../../../core/services/navigation-modal/navigation-modal.service';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { LocalStorageServiceStub } from '../../../core/services/local-storage/local-storage.service.stub';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage.service';
import { HtmlRemoverService } from '../../../shared/services/html-remover/html-remover.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { AutocompleteApiService } from '../../../core/services/autocomplete/autocomplete-api.service';

describe('DropdownListModalComponent', () => {
  let component: DropdownListModalComponent;
  let fixture: ComponentFixture<DropdownListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DropdownListModalComponent,
        DropdownListComponent,
        FilterPipe,
      ],
      imports:[
        BaseModule,
        ConfirmationModalModule,
      ],
      providers:[
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        EventBusService,
        UnsubscribeService,
        FormPlayerApiService,
        InitDataService,
        LoggerService,
        NavigationModalService,
        UtilsService,
        HtmlRemoverService,
        CurrentAnswersService,
        AutocompleteApiService,
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownListModalComponent);
    component = fixture.componentInstance;
    component.componentId = '';
    component.data$ = of({ title: '', items: [] } as any);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal', () => {
    jest.spyOn(component, 'closeModal');
    component.detachView = () => null;
    expect(component.closeModal).toHaveBeenCalledTimes(0);
  });
});
