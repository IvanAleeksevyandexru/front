import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { ConfigService, DeviceDetectorService, DeviceDetectorServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { PhotoRequirementsModalComponent } from './photo-requirements-modal.component';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
// eslint-disable-next-line max-len
import { PhotoRequirementsModalSetting } from './photo-requirements-modal.interface';
import { ModalService, ModalServiceStub, CtaModalComponent } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../../shared/directives/action/action.service.stub';
import { uploadPhotoElemId } from '../../../../../../shared/components/upload-and-edit-photo-form/upload-and-edit-photo-form.constant';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { configureTestSuite } from 'ng-bullet';
import { SmuEventsService } from '@epgu/epgu-lib';

describe('PhotoRequirementsModalComponent', () => {
  let component: PhotoRequirementsModalComponent;
  let fixture: ComponentFixture<PhotoRequirementsModalComponent>;
  let settingMock: PhotoRequirementsModalSetting = {
    warning:
      'Убедитесь, что ваша фотография соответствует требованиям ведомства. Это важно, чтобы заявление приняли.',
    body: [
      {
        title: '<b>Фотография ребёнка</b>',
        text:
          'К фото ребёнка те же требования, что и к фото взрослого. Ребёнок в кадре должен быть один, без посторонних предметов.',
        type: 'child',
        examplePhotos: [{ valid: true, description: 'Смотрит прямо', type: 'eyes-forward' }],
      },
    ],
    footer: '<a id="howtotakephoto">Как сделать фото самостоятельно</a>',
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        PhotoRequirementsModalComponent,
        MockComponent(CtaModalComponent),
      ],
      imports: [BaseModule, BaseComponentsModule],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        CurrentAnswersService,
        UnsubscribeService,
        EventBusService,
        CurrentAnswersService,
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        SmuEventsService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoRequirementsModalComponent);
    component = fixture.componentInstance;
    component.setting = settingMock;
    fixture.detectChanges();
  });

  it('should be create buttons', () => {
    expect(component.buttons.length).toBeGreaterThan(0);
  });

  describe('handleClickOnElemById', () => {
    it('should be close modal', () => {
      jest.spyOn(component, 'closeModal');
      jest.spyOn(component.modalResult, 'next');
      component.detachView = () => null;
      const event = { target: { id: uploadPhotoElemId.howToTakePhoto }} as any;
      component.handleClickOnElemById(event);
      expect(component.closeModal).toHaveBeenCalled();
      expect(component.modalResult.next).toHaveBeenCalledWith(uploadPhotoElemId.howToTakePhoto);
    });

    it('should be not close modal', () => {
      jest.spyOn(component, 'closeModal');
      component.detachView = () => null;
      const event = { target: { id: '' }} as any;
      component.handleClickOnElemById(event);
      expect(component.closeModal).toHaveBeenCalledTimes(0);
    });
  });
});
