import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { ConfigService } from '../../../../../../core/services/config/config.service';
import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { PhotoRequirementsModalComponent } from './photo-requirements-modal.component';
import { ConfigServiceStub } from '../../../../../../core/services/config/config.service.stub';
import { BaseModule } from '../../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
// eslint-disable-next-line max-len
import { ConfirmationModalBaseComponent } from '../../../../../../modal/confirmation-modal/confirmation-modal-base/confirmation-modal-base.component';
import { PhotoRequirementsModalSetting } from './photo-requirements-modal.interface';
import { ModalService } from '../../../../../../modal/modal.service';
import { ModalServiceStub } from '../../../../../../modal/modal.service.stub';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../../shared/directives/action/action.service.stub';
import { uploadPhotoElemId } from '../../../../../../shared/components/upload-and-edit-photo-form/upload-and-edit-photo-form.constant';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { configureTestSuite } from 'ng-bullet';

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
        MockComponent(ConfirmationModalBaseComponent),
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
