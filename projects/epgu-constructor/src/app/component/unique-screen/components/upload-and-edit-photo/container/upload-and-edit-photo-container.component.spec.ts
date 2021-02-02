import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { EventBusService } from '../../../../../core/services/event-bus/event-bus.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { UploadAndEditPhotoContainerComponent } from './upload-and-edit-photo-container.component';
import { ComponentDto } from '../../../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { MockComponent, MockModule } from 'ng-mocks';
import { PhotoFormComponent } from '../component/photo-form/photo-form.component';
import { PhotoDescriptionComponent } from '../component/photo-description/photo-description.component';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../core/services/config/config.service.stub';
import { ScreenContainerModule } from '../../../../../shared/components/screen-container/screen-container.module';
import { UserInfoLoaderModule } from '../../../../../shared/components/user-info-loader/user-info-loader.module';
import { BaseModule } from '../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../shared/components/base-components/base-components.module';

describe('UploadAndEditPhotoContainerComponent', () => {
  let component: UploadAndEditPhotoContainerComponent;
  let fixture: ComponentFixture<UploadAndEditPhotoContainerComponent>;
  let mockData: ComponentDto = {
    id: 'pd5',
    type: 'PhotoUploadComponent',
    label:
      '<p><a id="howtotakephoto">Требования к фото</a></p><p><a id="requirements">Как сделать фото самостоятельно</a></p>',
    attrs: {
      uploadedFile: {
        uploadId: 'passport_photo',
        mnemonic: 'pd5.PhotoUploadComponent.passport_photo.0',
        objectType: 2,
        name: 'fieldList.jpg',
        fileType: ['JPEG', 'JPG', 'PNG', 'BMP'],
        maxSize: 5242880,
        objectId: '',
      },
      clarifications: {
        howtotakephoto: {
          title: ' ',
          text:
            '<ol style="padding-left: 20px"><br><li style="color: #0d4cd3"> <a id="requirements">примеры удачных фотографий</a></li></ol>',
        },
        requirements: {
          setting: {
            warning:
              'Убедитесь, что ваша фотография соответствует требованиям ведомства. Это важно, чтобы заявление приняли.',
            body: [
              {
                title: '<b>Фотография ребёнка</b>',
                text:
                  'К фото ребёнка те же требования, что и к фото взрослого. Ребёнок в кадре должен быть один, без посторонних предметов.',
                type: 'child',
                examplePhotos: [
                  { valid: true, description: 'Смотрит прямо', type: 'eyes-forward' },
                ],
              },
            ],
            footer: '<a id="howtotakephoto">Как сделать фото самостоятельно</a>',
          },
        },
      },
    },
    linkedValues: [],
    arguments: {},
    value: '',
    required: true,
  };
  let screenService: ScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        UploadAndEditPhotoContainerComponent,
        MockComponent(PhotoFormComponent),
        MockComponent(PhotoDescriptionComponent),
      ],
      imports: [
        RouterTestingModule,
        MockModule(ScreenContainerModule),
        MockModule(UserInfoLoaderModule),
        MockModule(BaseModule),
        MockModule(BaseComponentsModule),
      ],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        EventBusService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadAndEditPhotoContainerComponent);
    screenService = TestBed.inject(ScreenService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
