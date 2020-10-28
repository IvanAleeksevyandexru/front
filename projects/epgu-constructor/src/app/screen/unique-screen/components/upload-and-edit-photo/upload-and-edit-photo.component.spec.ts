import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAndEditPhotoComponent } from './upload-and-edit-photo.component';
import { UploadAndEditPhotoModule } from './upload-and-edit-photo.module';
import { TerraByteApiService } from '../../../../shared/services/terra-byte-api/terra-byte-api.service';
import { ConfigService } from '../../../../config/config.service';
import { ComponentBase } from '../../../screen.types';
import { ScreenService } from '../../../screen.service';
import { Subject } from 'rxjs';
import { WebcamService } from '../../services/webcam/webcam.service';

class МockScreenService {
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
      imports: [ UploadAndEditPhotoModule ],
      providers: [
        TerraByteApiService,
        ConfigService,
        WebcamService,
        { provide: ScreenService, useClass: МockScreenService },
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
