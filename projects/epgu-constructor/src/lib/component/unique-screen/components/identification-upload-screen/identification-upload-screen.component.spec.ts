import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseComponentsModule, BusEventType, EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { MockDirective, MockProvider } from 'ng-mocks';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ActionDirective } from '../../../../shared/directives/action/action.directive';
import { ActionService } from '../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../shared/directives/action/action.service.stub';
import { ModalService, ModalServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { CertificateEaisdoService } from '../../../../shared/services/certificate-eaisdo/certificate-eaisdo.service';
import { IdentificationApiService } from '../../shared/identification-api/identification-api.service';
import { IdentificationApiServiceStub } from '../../shared/identification-api/identification-api.service.stub';
import { IdentificationUploadScreenComponent } from './identification-upload-screen.component';
import { IdentificationUploadScreenModule } from './identification-upload-screen.module';
import {
  FileUploadItem,
  UploadedFile,
} from '../../../../core/services/terra-byte-api/terra-byte-api.types';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { of } from 'rxjs';
import { PassportIdentificationResponse } from '../../shared/identification-api/identification-api.types';
import { UniqueScreenComponentTypes } from '../../unique-screen-components.types';
import { TerraByteApiService } from '../../../../core/services/terra-byte-api/terra-byte-api.service';
import { TerraByteApiServiceStub } from '../../../../core/services/terra-byte-api/terra-byte-api.service.stub';
import { AutocompletePrepareService } from '../../../../core/services/autocomplete/autocomplete-prepare.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const componentMock = {
  id: 'id',
  type: UniqueScreenComponentTypes.IdentificationUploadComponent,
  attrs: { uploads: [] },
};

describe('IdentificationUploadScreenComponent', () => {
  let component: IdentificationUploadScreenComponent;
  let fixture: ComponentFixture<IdentificationUploadScreenComponent>;

  let screenService: ScreenServiceStub;
  let eventBusService: EventBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BaseComponentsModule, IdentificationUploadScreenModule, HttpClientTestingModule],
      declarations: [MockDirective(ActionDirective)],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: IdentificationApiService, useClass: IdentificationApiServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: TerraByteApiService, useClass: TerraByteApiServiceStub },
        MockProvider(AutocompletePrepareService),
        EventBusService,
        CertificateEaisdoService,
        CurrentAnswersService,
      ],
    }).overrideComponent(IdentificationUploadScreenComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    });
  });

  beforeEach(() => {
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    screenService.component = componentMock as any;
    eventBusService = TestBed.inject(EventBusService);

    fixture = TestBed.createComponent(IdentificationUploadScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('getRequest()', () => {
    const uploadedFile = {} as UploadedFile;
    it('should call selfieIdentification api', () => {
      const spy = jest.spyOn(component['identification'], 'selfieIdentification');
      screenService.component = ({ arguments: { faceId: '1' }} as unknown) as ComponentDto;

      component.getRequest(uploadedFile);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call selfie passportIdentification api', () => {
      const spy = jest.spyOn(component['identification'], 'passportIdentification');
      screenService.component = ({ arguments: { faceId: '' }} as unknown) as ComponentDto;

      component.getRequest(uploadedFile);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should round quality', (done) => {
      const mockQualityResponse = ({
        quality: { test: 1.211 },
      } as unknown) as PassportIdentificationResponse;
      const spy = jest
        .spyOn(component['identification'], 'passportIdentification')
        .mockImplementation((...args) => of(mockQualityResponse));
      screenService.component = ({ arguments: { faceId: '' }} as unknown) as ComponentDto;

      component.getRequest(uploadedFile).subscribe((value) => {
        const state: any = component['currentAnswersService'].state;
        expect(state.quality.test).toEqual(121);
        done();
      });
    });

    it('should round specific fields', (done) => {
      const mockQualityResponse = ({
        quality: { test: 1.211 },
        similarity: 1.211,
        similarityFaceId: 1.211,
        similaritySelfieFaceId: 1.211,
      } as unknown) as PassportIdentificationResponse;
      jest
        .spyOn(component['identification'], 'passportIdentification')
        .mockImplementation((...args) => of(mockQualityResponse));
      screenService.component = ({ arguments: { faceId: '' }} as unknown) as ComponentDto;

      component.getRequest(uploadedFile).subscribe((value) => {
        const state: any = component['currentAnswersService'].state;
        expect(state.similarity).toEqual(121);
        expect(state.similarityFaceId).toEqual(121);
        expect(state.similaritySelfieFaceId).toEqual(121);
        done();
      });
    });
  });

  describe('initUploader()', () => {
    it('should change fields on passed object()', () => {
      const uploadItem = ({ maxCountByTypes: 2 } as unknown) as FileUploadItem;

      const res = component.initUploader(uploadItem);

      expect(Object.keys(res).length).toBe(3);
      expect(res.maxCountByTypes).toBeUndefined();
    });
  });

  describe('ngOnInit()', () => {
    let uploaders;
    beforeEach(() => {
      uploaders = {
        files: [
          { required: true, value: [{ uploaded: true }] },
          { required: true, value: [{ uploaded: true }] },
        ],
        errors: [],
      };
    });

    it('should not disable button', () => {
      component.ngOnInit();

      eventBusService.emit(BusEventType.FileUploadValueChangedEvent, uploaders);

      expect(component.disabled$$.getValue()).toBeFalsy();
    });

    it('should disable button if errors', () => {
      uploaders.errors.push(1);
      component.ngOnInit();

      eventBusService.emit(BusEventType.FileUploadValueChangedEvent, uploaders);

      expect(component.disabled$$.getValue()).toBeTruthy();
    });

    it('should disable button if no required', () => {
      uploaders.files[0].required = false;
      uploaders.files[1].required = false;
      component.ngOnInit();

      eventBusService.emit(BusEventType.FileUploadValueChangedEvent, uploaders);

      expect(component.disabled$$.getValue()).toBeTruthy();
    });

    it('should disable button if no uploaded', () => {
      uploaders.files[0].value[0].uploaded = false;
      component.ngOnInit();

      eventBusService.emit(BusEventType.FileUploadValueChangedEvent, uploaders);

      expect(component.disabled$$.getValue()).toBeTruthy();
    });
  });

  describe('setProcessingStatus()', () => {
    it('should be processing event status = true', () => {
      jest.spyOn(component.uploaderProcessing, 'next');
      jest.spyOn(screenService, 'updateLoading');
      eventBusService.emit(BusEventType.UploaderProcessingStatus, { status: true, uploadId: '1' });
      expect(component.uploaderProcessing.next).toHaveBeenCalledWith(['1']);
      expect(screenService.updateLoading).toHaveBeenCalledWith(true);
    });

    it('should be processing event status = false', () => {
      eventBusService.emit(BusEventType.UploaderProcessingStatus, { status: true, uploadId: '1' });
      eventBusService.emit(BusEventType.UploaderProcessingStatus, { status: true, uploadId: '2' });
      eventBusService.emit(BusEventType.UploaderProcessingStatus, { status: false, uploadId: '2' });
      jest.spyOn(component.uploaderProcessing, 'next');
      jest.spyOn(screenService, 'updateLoading');
      eventBusService.emit(BusEventType.UploaderProcessingStatus, { status: false, uploadId: '1' });
      expect(component.uploaderProcessing.next).toHaveBeenCalledWith([]);
      expect(screenService.updateLoading).toHaveBeenCalledWith(false);
    });
  });

  describe('collectMaxFilesNumber()', () => {
    it('should count max number to uploads count', (done) => {
      component.allMaxFiles = 0;
      screenService.component = {
        id: 'id',
        type: UniqueScreenComponentTypes.IdentificationUploadComponent,
        attrs: { uploads: [{ maxFileCount: 9 }, { maxFileCount: 9 }] },
      } as any;

      component.data$.subscribe((value) => {
        expect(component.allMaxFiles).toBe(2);
        done();
      });
    });
  });
});
