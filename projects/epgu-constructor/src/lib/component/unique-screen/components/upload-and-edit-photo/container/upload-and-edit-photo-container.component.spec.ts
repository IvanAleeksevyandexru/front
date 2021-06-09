import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

import { ScreenService } from '../../../../../screen/screen.service';
import { UploadAndEditPhotoContainerComponent } from './upload-and-edit-photo-container.component';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { MockComponent, MockModule } from 'ng-mocks';
import { PhotoFormComponent } from '../../../../../shared/components/upload-and-edit-photo-form/components/photo-form/photo-form.component';
import { PhotoDescriptionComponent } from '../component/photo-description/photo-description.component';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../core/services/config/config.service.stub';
import { ScreenContainerModule } from '../../../../../shared/components/screen-container/screen-container.module';
import { UserInfoLoaderModule } from '../../../../../shared/components/user-info-loader/user-info-loader.module';
import { BaseModule } from '../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../shared/components/base-components/base-components.module';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ActionService } from '../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../shared/directives/action/action.service.stub';
import { configureTestSuite } from 'ng-bullet';
import { ComponentDto } from '@epgu/epgu-constructor-types';

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
          title: '',
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
    value: '',
    required: true,
  };
  let screenService: ScreenService;

  configureTestSuite(() => {
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
        { provide: ActionService, useClass: ActionServiceStub },
        CurrentAnswersService,
      ],
    })
      .overrideComponent(UploadAndEditPhotoContainerComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadAndEditPhotoContainerComponent);
    screenService = TestBed.inject(ScreenService);
    screenService.component = mockData;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('changeCroppedImageUrl', () => {
    it('should create', () => {
      jest.spyOn(component, 'changeCroppedImageUrl');
      const selector = 'epgu-constructor-photo-form';
      const debugEl = fixture.debugElement.query(By.css(selector));
      debugEl.triggerEventHandler('croppedImageUrlEvent', 'image');
      expect(component.changeCroppedImageUrl).toHaveBeenCalled();
      expect(component.croppedImageUrl).toBe('image');
    });
  });

  describe('changeCroppedPhoto', () => {
    it('should be call startToChangeCroppedImageUrl$', () => {
      jest.spyOn(component.startToChangeCroppedImageUrl$, 'next');
      component.croppedImageUrl = 'image';
      fixture.detectChanges();
      const selector = 'lib-button';
      const debugEl = fixture.debugElement.query(By.css(selector));
      debugEl.triggerEventHandler('click', {});
      expect(component.startToChangeCroppedImageUrl$.next).toBeCalledWith({ isStart: true });
    });
  });

  describe('uploadPhotoToServer', () => {
    it('should be call startToUploadPhoto$', () => {
      jest.spyOn(component.startToUploadPhoto$, 'next');
      component.croppedImageUrl = 'image';
      fixture.detectChanges();
      const selector = '.submit-button';
      const debugEl = fixture.debugElement.query(By.css(selector));
      debugEl.triggerEventHandler('click', {});
      expect(component.startToUploadPhoto$.next).toBeCalledWith({ isStart: true });
    });
  });

  describe('nextStep', () => {
    it('should be call nextStep', () => {
      jest.spyOn(component, 'nextStep');
      const selector = 'epgu-constructor-photo-form';
      const debugEl = fixture.debugElement.query(By.css(selector));
      debugEl.triggerEventHandler('uploadPhotoToServerEvent', {});
      expect(component.nextStep).toHaveBeenCalled();
    });
  });
});
