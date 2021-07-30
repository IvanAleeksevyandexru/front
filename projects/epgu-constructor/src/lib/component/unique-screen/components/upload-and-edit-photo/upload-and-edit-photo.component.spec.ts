import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';
import { CoreModule } from '../../../../core/core.module';
import {
  CoreUiModule,
  LocationService,
  TypeHelperService,
  WINDOW_PROVIDERS,
  WordTransformService
} from '@epgu/epgu-constructor-ui-kit';
import { ConfigService, HealthService } from '@epgu/epgu-constructor-ui-kit';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../screen/screen.service';
import { ComponentBase } from '../../../../screen/screen.types';
import { TerraByteApiService } from '../../../../core/services/terra-byte-api/terra-byte-api.service';
import { WebcamService } from '../../../../core/services/webcam/webcam.service';
import { UploadAndEditPhotoContainerComponent } from './container/upload-and-edit-photo-container.component';
import { UploadAndEditPhotoModule } from './upload-and-edit-photo.module';
import { FormPlayerApiService } from '../../../../form-player/services/form-player-api/form-player-api.service';
import { HtmlRemoverService } from '../../../../shared/services/html-remover/html-remover.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { AutocompleteApiService } from '../../../../core/services/autocomplete/autocomplete-api.service';
import { configureTestSuite } from 'ng-bullet';
import { FormPlayerServiceStub } from '../../../../form-player/services/form-player/form-player.service.stub';
import { FormPlayerService } from '../../../../form-player/services/form-player/form-player.service';
import { EaisdoGroupCostService } from '../../../../shared/services/eaisdo-group-cost/eaisdo-group-cost.service';

class MockScreenService {
  header = '';
  display = {
    components: [],
  };
  isLoading = new Subject().asObservable();
  orderId = 1;
}

describe('UploadAndEditPhotoComponent', () => {
  let component: UploadAndEditPhotoContainerComponent;
  let fixture: ComponentFixture<UploadAndEditPhotoContainerComponent>;
  let mockData: ComponentBase = {
    attrs: {
      uploadedFile: {
        mnemonic: '',
        name: '',
        objectType: 2,
      },
      clarifications: {
        howtotakephoto: '',
        requirements: {
          setting: {
            warning: '',
            body: [],
            footer: '',
          },
        },
      },
    },
    id: '',
    label: '',
    type: '',
    value: '',
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [UploadAndEditPhotoModule, RouterTestingModule, CoreModule, CoreUiModule],
      providers: [
        TerraByteApiService,
        HealthService,
        ConfigService,
        WebcamService,
        LocationService,
        WINDOW_PROVIDERS,
        { provide: ScreenService, useClass: MockScreenService },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        EventBusService,
        UnsubscribeService,
        FormPlayerApiService,
        HtmlRemoverService,
        CurrentAnswersService,
        AutocompleteApiService,
        EaisdoGroupCostService,
        WordTransformService,
        TypeHelperService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadAndEditPhotoContainerComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
