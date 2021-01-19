import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from 'epgu-lib';
import { Subject } from 'rxjs';
import { CoreModule } from '../../../../core/core.module';
import { WINDOW_PROVIDERS } from '../../../../core/providers/window.provider';
import { ConfigService } from '../../../../core/services/config/config.service';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { LocationService } from '../../../../core/services/location/location.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ComponentBase } from '../../../../screen/screen.types';
import { TerraByteApiService } from '../../services/terra-byte-api/terra-byte-api.service';
import { WebcamService } from '../../services/webcam/webcam.service';
import { UploadAndEditPhotoComponent } from './upload-and-edit-photo.component';
import { UploadAndEditPhotoModule } from './upload-and-edit-photo.module';



class MockScreenService {
  header = '';
  display = {
    components: [],
  };
  isLoading = new Subject().asObservable();
  orderId = 1;
}

describe('UploadAndEditPhotoComponent', () => {
  let component: UploadAndEditPhotoComponent;
  let fixture: ComponentFixture<UploadAndEditPhotoComponent>;
  let mockData: ComponentBase = {
    attrs: {
      uploadedFile: {
        mnemonic:'',
        name: '',
        objectType: 2,
      },
      clarifications: {
        howtotakephoto:'',
        requirements: {
          setting: {
            warning: '',
            body: [],
            footer: '',
          }
        },
      }
    },
    id: '',
    label: '',
    type: '',
    value: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UploadAndEditPhotoModule, RouterTestingModule, CoreModule ],
      providers: [
        TerraByteApiService,
        HealthService,
        ConfigService,
        WebcamService,
        LocationService,
        WINDOW_PROVIDERS,
        { provide: ScreenService, useClass: MockScreenService },
        EventBusService,
        UnsubscribeService,
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadAndEditPhotoComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
