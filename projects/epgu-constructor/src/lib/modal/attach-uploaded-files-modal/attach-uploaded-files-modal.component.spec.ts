import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusEventType, DeviceDetectorServiceStub, ObjectHelperService } from '@epgu/epgu-constructor-ui-kit';
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

describe('AttachUploadedFilesModalComponent', () => {
  let component: AttachUploadedFilesModalComponent;
  let fixture: ComponentFixture<AttachUploadedFilesModalComponent>;
  let screenService: ScreenService;
  let eventBusService: EventBusService;
  let viewerService: ViewerService;
  let mockFile = new FileItem(FileItemStatus.uploaded, '', null, {
    fileUid: 1882562370,
    metaId: 1874333481,
    objectId: '763706287',
    objectTypeId: 2,
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
    alternativeMimeTypes: [],
    uploaded: true,
  });
  let mockSuggestions: ISuggestionItem = {
    mnemonic: 'prev_files',
    list: [
      {
        mnemonic: 'mnemonic',
        value:
          // eslint-disable-next-line max-len
          '{"id":"fu3","type":"FileUploadComponent","uploads":[{"uploadId":"passport","value":[{"fileUid":1882562370,"metaId":1874333481,"objectId":763706287,"objectTypeId":2,"mnemonic":"fu3.FileUploadComponent.passport.0","fileName":"man-h1.jpg","fileExt":"jpg","fileSize":154326,"mimeType":"image/jpeg","hasSign":false,"created":"2021-03-03","updated":"2021-03-03","realPath":"16/0/0/18/82/56/23/s0R60pG98E8X","deleted":false,"bucket":"epgu202103","nodeId":"f_dc","userId":1000298933,"alternativeMimeTypes":[],"uploaded":true}}]}]}',
      },
    ],
  };

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
    screenService.suggestions = { modalId: mockSuggestions };
    fixture = TestBed.createComponent(AttachUploadedFilesModalComponent);
    component = fixture.componentInstance;
    component.componentId = 'modalId';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should set suggestions after inited, if any', () => {
      screenService.suggestions$.subscribe(() => {
        expect(component.suggestions).toBeTruthy();
      });
    });

    it('should set suggestionsFilesGroupByDate after inited, if any', () => {
      screenService.suggestions$.subscribe(() => {
        expect(component.suggestionsFilesGroupByDate.length).toBeGreaterThan(0);
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

    it('should call handleFileDeleted() on "fileDeletedEvent"', () => {
      const handleFileDeletedSpy = spyOn(component, 'handleFileDeleted');
      eventBusService.on(BusEventType.FileDeletedEvent).subscribe(() => {
        expect(handleFileDeletedSpy).toBeCalled();
      });
      eventBusService.emit(BusEventType.FileDeletedEvent);
    });
  });

  describe('previewFile()', () => {
    it('should call viewerService.open()', () => {
      const viewerServiceOpenSpy = jest.spyOn(viewerService, 'open').mockReturnValue(of());
      component.previewFile(mockFile);
      expect(viewerServiceOpenSpy).toBeCalled();
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
