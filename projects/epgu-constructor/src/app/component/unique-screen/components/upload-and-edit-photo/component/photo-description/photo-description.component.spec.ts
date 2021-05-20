import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockModule } from 'ng-mocks';
import { of } from 'rxjs';

import { PhotoDescriptionComponent } from './photo-description.component';
import { SafeModule } from '../../../../../../shared/pipes/safe/safe.module';
import { ModalService } from '../../../../../../modal/modal.service';
import { ModalServiceStub } from '../../../../../../modal/modal.service.stub';
import { uploadPhotoElemId } from '../../../../../../shared/components/upload-and-edit-photo-form/upload-and-edit-photo-form.constant';
import { configureTestSuite } from 'ng-bullet';
import { ComponentDto } from '@epgu/epgu-constructor-types';

describe('PhotoDescriptionComponent', () => {
  let component: PhotoDescriptionComponent;
  let fixture: ComponentFixture<PhotoDescriptionComponent>;
  let modalService: ModalService;
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

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoDescriptionComponent],
      imports: [RouterTestingModule, MockModule(SafeModule)],
      providers: [{ provide: ModalService, useClass: ModalServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoDescriptionComponent);
    modalService = TestBed.inject(ModalService);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleClickOnElemById', () => {
    it('should be call openRequirementsModal', () => {
      jest.spyOn(component, 'openRequirementsModal');
      const event = { target: { id: 'howtotakephoto' }};
      component.handleClickOnElemById(event as any);
      expect(component.openRequirementsModal).toHaveBeenCalled();
    });

    it('should be call openHowPhotoModal', () => {
      jest.spyOn(component, 'openHowPhotoModal');
      const event = { target: { id: 'requirements' }};
      component.handleClickOnElemById(event as any);
      expect(component.openHowPhotoModal).toHaveBeenCalled();
    });
  });

  describe('setHowPhotoModalParams', () => {
    it('should be set params to setHowPhotoModalParams', () => {
      expect(component.howPhotoModalParameters.text).toEqual(
        mockData?.attrs?.clarifications[uploadPhotoElemId.howToTakePhoto]?.text,
      );
    });
  });

  describe('openRequirementsModal', () => {
    it('should be call openHowPhotoModal if has value', () => {
      jest.spyOn(modalService, 'openModal').mockReturnValue(of(uploadPhotoElemId.howToTakePhoto));
      jest.spyOn(component, 'openHowPhotoModal');
      component.openRequirementsModal();
      expect(component.openHowPhotoModal).toHaveBeenCalled();
    });

    it('should be not call openHowPhotoModal', () => {
      jest.spyOn(modalService, 'openModal').mockReturnValue(of(''));
      jest.spyOn(component, 'openHowPhotoModal');
      component.openRequirementsModal();
      expect(component.openHowPhotoModal).toBeCalledTimes(0);
    });
  });

  describe('openHowPhotoModal', () => {
    it('should be call openRequirementsModal if has value', () => {
      jest.spyOn(modalService, 'openModal').mockReturnValue(of(uploadPhotoElemId.requirements));
      jest.spyOn(component, 'openRequirementsModal');
      component.openHowPhotoModal();
      expect(component.openRequirementsModal).toHaveBeenCalled();
    });

    it('should be not call openRequirementsModal', () => {
      jest.spyOn(modalService, 'openModal').mockReturnValue(of(''));
      jest.spyOn(component, 'openRequirementsModal');
      component.openHowPhotoModal();
      expect(component.openRequirementsModal).toBeCalledTimes(0);
    });
  });
});
