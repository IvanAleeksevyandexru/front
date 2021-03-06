import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DeviceDetectorServiceStub,
  ObjectHelperService,
  JsonHelperService,
  DeviceDetectorService,
  EventBusService,
  UnsubscribeService,
  DatesToolsService,
  ConfigService,
  ConfigServiceStub,
  DownloadService,
  HealthService,
  HealthServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { cloneDeep } from 'lodash';
import { AttachUploadedFilesModalComponent } from './attach-uploaded-files-modal.component';
import { BaseModule } from '../../shared/base.module';
import { ScreenService } from '../../screen/screen.service';
import { ScreenServiceStub } from '../../screen/screen.service.stub';
import { ViewerService } from '../../shared/components/uploader/services/viewer/viewer.service';
import { AutocompleteApiService } from '../../core/services/autocomplete/autocomplete-api.service';
import { AutocompleteService } from '../../core/services/autocomplete/autocomplete.service';
import { CurrentAnswersService } from '../../screen/current-answers.service';
import { FileItem, FileItemStatus } from '../../shared/components/file-upload/data';
import { AutocompletePrepareService } from '../../core/services/autocomplete/autocomplete-prepare.service';
import { ConfirmationModalModule } from '../confirmation-modal/confirmation-modal.module';
import { UploadedFile } from '../../core/services/terra-byte-api/terra-byte-api.types';
import { TerraByteApiService } from '../../core/services/terra-byte-api/terra-byte-api.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AttachUploadedFilesModalComponent', () => {
  let component: AttachUploadedFilesModalComponent;
  let fixture: ComponentFixture<AttachUploadedFilesModalComponent>;
  let screenService: ScreenService;
  let eventBusService: EventBusService;
  let viewerService: ViewerService;
  const mockUploadedFile: UploadedFile = {
    fileUid: 1882562370,
    metaId: 1874333481,
    objectId: '763706287',
    objectTypeId: 2,
    objectType: 2,
    description: '',
    mnemonic: 'fu3.FileUploadComponent.passport.0',
    fileName: 'man-h1.jpg',
    fileExt: 'jpg',
    fileSize: 154326,
    mimeType: 'image/jpeg',
    hasSign: false,
    hasError: false,
    created: '2021-03-03',
    updated: '2021-03-03',
    realPath: '16/0/0/18/82/56/23/s0R60pG98E8X',
    deleted: false,
    bucket: 'epgu202103',
    nodeId: 'f_dc',
    userId: 1000298933,
    previewType: null,
    alternativeMimeTypes: [],
    uploaded: true,
  };
  const mockFile = new FileItem(FileItemStatus.uploaded, '', null, mockUploadedFile);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttachUploadedFilesModalComponent],
      imports: [BaseModule, ConfirmationModalModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: HealthService, useClass: HealthServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        EventBusService,
        UnsubscribeService,
        DatesToolsService,
        ViewerService,
        AutocompleteService,
        AutocompleteApiService,
        AutocompletePrepareService,
        DownloadService,
        ObjectHelperService,
        CurrentAnswersService,
        JsonHelperService,
        TerraByteApiService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    eventBusService = TestBed.inject(EventBusService);
    viewerService = TestBed.inject(ViewerService);
    fixture = TestBed.createComponent(AttachUploadedFilesModalComponent);
    component = fixture.componentInstance;
    component.componentId = 'modalId';
    component.acceptTypes = 'jpg,png';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should set galleryFilesGroupByDate after inited, if any', () => {
      screenService.suggestions$.subscribe(() => {
        expect(component.galleryFilesGroupByDate.length).toBeGreaterThan(0);
      });
    });

    it('should call closeModal() on "closeModalEvent_previewFiles"', () => {
      const componentCloseModalSpy = jest.spyOn(component, 'closeModal');
      // TODO ???????????????? ???????????????????????? ???????????????? ?? enum BusEventType ?????????? ???????????????????? typescript
      eventBusService.on('closeModalEvent_previewFiles').subscribe(() => {
        expect(componentCloseModalSpy).toBeCalled();
      });
      // TODO ???????????????? ???????????????????????? ???????????????? ?? enum BusEventType ?????????? ???????????????????? typescript
      eventBusService.emit('closeModalEvent_previewFiles');
    });
  });

  describe('previewFile()', () => {
    it('should call viewerService.open()', () => {
      const spy = jest.spyOn(viewerService, 'open');
      component.previewFile(mockFile);
      expect(spy).toBeCalled();
    });
  });

  describe('isSameFile()', () => {
    it('should return true, if objectId, objectType, mnemonic are the same', () => {
      const resultFile = cloneDeep(mockFile);
      expect(component.isSameFile(mockFile, resultFile)).toBeTruthy();
    });
    it('should return false, if any of objectId, objectType, mnemonic is not the same', () => {
      const resultFile = cloneDeep(mockFile);
      resultFile.item.mnemonic = 'someNewMnemonic';
      expect(component.isSameFile(mockFile, resultFile)).toBeFalsy();
    });
  });

  describe('isIncludedToList()', () => {
    it('should return true, if file passes acceptTypes checks', () => {
      expect(component.isIncludedToList(mockUploadedFile)).toBeTruthy();
    });
    it('should return false, if file does not pass acceptTypes checks', () => {
      const newMockUploadedFile = cloneDeep(mockUploadedFile);
      newMockUploadedFile.fileExt = 'pdf';
      expect(component.isIncludedToList(newMockUploadedFile)).toBeFalsy();
    });
  });
});
