import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BusEventType,
  DeviceDetectorServiceStub,
  ObjectHelperService,
} from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { AttachUploadedFilesModalComponent } from './attach-uploaded-files-modal.component';
import { BaseModule } from '../../shared/base.module';
import { ScreenService } from '../../screen/screen.service';
import { ScreenServiceStub } from '../../screen/screen.service.stub';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ISuggestionItem } from '../../core/services/autocomplete/autocomplete.inteface';
import { ViewerService } from '../../shared/components/uploader/services/viewer/viewer.service';
import { AutocompleteApiService } from '../../core/services/autocomplete/autocomplete-api.service';
import { AutocompleteService } from '../../core/services/autocomplete/autocomplete.service';
import { DownloadService } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../screen/current-answers.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FileItem, FileItemStatus } from '../../shared/components/file-upload/data';
import { configureTestSuite } from 'ng-bullet';
import { AutocompletePrepareService } from '../../core/services/autocomplete/autocomplete-prepare.service';
import { ConfirmationModalModule } from '../confirmation-modal/confirmation-modal.module';
import { JsonHelperService } from '../../core/services/json-helper/json-helper.service';
import { of } from 'rxjs';
import { cloneDeep } from 'lodash';
import { UploadedFile } from '../../core/services/terra-byte-api/terra-byte-api.types';

describe('AttachUploadedFilesModalComponent', () => {
  let component: AttachUploadedFilesModalComponent;
  let fixture: ComponentFixture<AttachUploadedFilesModalComponent>;
  let screenService: ScreenService;
  let eventBusService: EventBusService;
  let viewerService: ViewerService;
  let mockUploadedFile: UploadedFile = {
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
  let mockFile = new FileItem(FileItemStatus.uploaded, '', null, mockUploadedFile);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [AttachUploadedFilesModalComponent],
      imports: [BaseModule, ConfirmationModalModule, HttpClientTestingModule],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
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
      const componentCloseModalSpy = spyOn(component, 'closeModal');
      // TODO Добавить динамическое значение в enum BusEventType после обновления typescript
      eventBusService.on('closeModalEvent_previewFiles').subscribe(() => {
        expect(componentCloseModalSpy).toBeCalled();
      });
      // TODO Добавить динамическое значение в enum BusEventType после обновления typescript
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
      expect(component['isSameFile'](mockFile, resultFile)).toBeTruthy();
    });
    it('should return false, if any of objectId, objectType, mnemonic is not the same', () => {
      const resultFile = cloneDeep(mockFile);
      resultFile.item.mnemonic = 'someNewMnemonic';
      expect(component['isSameFile'](mockFile, resultFile)).toBeFalsy();
    });
  });

  describe('isIncludedToList()', () => {
    it('should return true, if file passes acceptTypes checks', () => {
      expect(component['isIncludedToList'](mockUploadedFile)).toBeTruthy();
    });
    it('should return false, if file does not pass acceptTypes checks', () => {
      const newMockUploadedFile = cloneDeep(mockUploadedFile);
      newMockUploadedFile.fileExt = 'pdf';
      expect(component['isIncludedToList'](newMockUploadedFile)).toBeFalsy();
    });
  });

  describe('getImgSrc()', () => {
    it('should return url for full file, if file null previewType', () => {
      const result = '/763706287/2/download?mnemonic=fu3.FileUploadComponent.passport.0';
      expect(component.getImgSrc(mockFile)).toBe(result);
    });
    it('should return url for preview file, if file has not null previewType', () => {
      const newMockFile = cloneDeep(mockFile);
      newMockFile.item.previewType = 1;
      const result = '/763706287/1/download?mnemonic=fu3.FileUploadComponent.passport.0';
      expect(component.getImgSrc(newMockFile)).toBe(result);
    });
  });

  describe('handleImgError()', () => {
    it('should set error on file', () => {
      const fileSetErrorSpy = spyOn(mockFile, 'setError');
      component.handleImgError({ target: { src: '' }}, mockFile);
      expect(fileSetErrorSpy).toBeCalled();
    });
  });
});
