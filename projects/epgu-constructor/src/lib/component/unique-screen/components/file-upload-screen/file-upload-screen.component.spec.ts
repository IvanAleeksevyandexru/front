import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusEventType, EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { FileUploadScreenComponent } from './file-upload-screen.component';
import { MockComponent, MockDirective } from 'ng-mocks';
import { PageNameComponent } from '../../../../shared/components/base-components/page-name/page-name.component';
import { ScreenContainerComponent } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload/file-upload.component';
import { ActionDirective } from '../../../../shared/directives/action/action.directive';
import {
  FileResponseToBackendUploadsItem,
  FileUploadAttributes,
  UploadedFile,
} from '../../../../core/services/terra-byte-api/terra-byte-api.types';
import { By } from '@angular/platform-browser';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';
import { ActionService } from '../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../shared/directives/action/action.service.stub';
import { ModalService, ModalServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { configureTestSuite } from 'ng-bullet';
import { ComponentDto, ActionType, DTOActionAction } from '@epgu/epgu-constructor-types';
import { LongButtonComponent } from '@epgu/epgu-constructor-ui-kit';
import { EaisdoGroupCostService } from '../../../../shared/services/eaisdo-group-cost/eaisdo-group-cost.service';
import { CertificateEaisdoService } from '../../../../shared/services/certificate-eaisdo/certificate-eaisdo.service';
import { PluralizeModule } from '@epgu/ui/pipes';
import { FileSizeModule } from '../../../../shared/pipes/file-size/file-size.module';
import { UploaderScreenService } from '../../../../shared/components/file-upload/services/screen/uploader-screen.service';

const screenServiceComponentMockData: ComponentDto = {
  attrs: {
    uploads: [
      {
        uploadId: '1',
        label: '',
        fileType: ['txt'],
        maxFileCount: 1,
        maxSize: 1000,
      },
    ],
    clarifications: null,
  } as FileUploadAttributes,
  id: '',
  label: '',
  type: 'FileUploadComponent',
  value: '',
} as ComponentDto;

const fileSample: UploadedFile = {
  description: '',
  fileName: 'file-name',
  objectId: 'object-id',
  objectTypeId: 1,
  mnemonic: 'mnemonic-sample',
  uploaded: true,
  fileSize: 100,
  hasError: false,
};

const button = {
  label: 'Далее',
  action: DTOActionAction.getNextStep,
  value: '',
  type: ActionType.nextStep,
};

describe('FileUploadScreenComponent', () => {
  let component: FileUploadScreenComponent;
  let fixture: ComponentFixture<FileUploadScreenComponent>;

  let screenService: ScreenService;
  let currentAnswersService: CurrentAnswersService;
  let eventBusService: EventBusService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [ScreenButtonsModule, PluralizeModule, FileSizeModule],
      declarations: [
        FileUploadScreenComponent,
        MockComponent(LongButtonComponent),
        MockComponent(ScreenContainerComponent),
        MockComponent(FileUploadComponent),
        MockComponent(PageNameComponent),
        MockDirective(ActionDirective),
      ],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        EventBusService,
        CertificateEaisdoService,
        CurrentAnswersService,
        EaisdoGroupCostService,
        UploaderScreenService,
      ],
    }).overrideComponent(FileUploadScreenComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    });
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    screenService.component = screenServiceComponentMockData;
    screenService.header = '';
    screenService.buttons = [button];
    jest.spyOn(screenService, 'componentErrors', 'get').mockReturnValue({});

    currentAnswersService = TestBed.inject(CurrentAnswersService);
    eventBusService = TestBed.inject(EventBusService);

    fixture = TestBed.createComponent(FileUploadScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('processing status', () => {
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

  describe('currentAnswersService.state', () => {
    it('should be undefined by default', () => {
      expect(currentAnswersService.state).toBeUndefined();
    });

    // eslint-disable-next-line max-len
    it('should be updated on EventBus fileUploadValueChangedEvent if NOT eventData.relatedUploads OR NOT currentAnswersService.state.uploads', () => {
      const eventData: FileResponseToBackendUploadsItem = {
        uploadId: 'id1',
        files: [
          {
            value: [fileSample],
          },
        ],
        errors: [],
      };

      eventBusService.emit(BusEventType.FileUploadValueChangedEvent, eventData);
      expect(currentAnswersService.state).toEqual({
        id: '',
        type: 'FileUploadComponent',
        uploads: [
          {
            value: [fileSample],
          },
        ],
        totalSize: 100,
        totalCount: 1
      });
    });

    // eslint-disable-next-line max-len
    it('should be updated on EventBus fileUploadValueChangedEvent if eventData.relatedUploads AND currentAnswersService.state.uploads', () => {
      currentAnswersService.state = {
        id: '',
        type: 'FileUploadComponent',
        uploads: [
          {
            value: [fileSample],
          },
        ],
      };

      const eventData: FileResponseToBackendUploadsItem = {
        files: [
          {
            value: [fileSample],
          },
        ],
        relatedUploads: {
          uploads: [
            {
              uploadId: 'id1',
              files: [],
            },
          ],
        },
      } as any;

      eventBusService.emit(BusEventType.FileUploadValueChangedEvent, eventData);

      expect(currentAnswersService.state).toEqual({
        id: '',
        type: 'FileUploadComponent',
        uploads: [
          {
            value: [fileSample],
          },
        ],
      });
    });
  });

  describe('epgu-cf-ui-screen-container', () => {
    const selector = 'epgu-cf-ui-screen-container';

    it('should be rendered', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('show-nav property should be equal to screenService.showNav$', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.showNav).toBeFalsy();

      screenService.showNav = true;
      fixture.detectChanges();

      expect(debugEl.componentInstance.showNav).toBeTruthy();
    });
  });

  describe('epgu-constructor-page-name', () => {
    const selector = 'epgu-constructor-page-name';

    it('should be rendered if component has label or screenService has header', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeNull();

      screenService.header = 'some header';
      screenService.component = {
        ...screenServiceComponentMockData,
        label: '',
      };
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();

      screenService.header = '';
      screenService.component = {
        ...screenServiceComponentMockData,
        label: 'some label',
      };
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();
    });
  });

  describe('epgu-constructor-file-upload', () => {
    const selector = 'epgu-constructor-file-upload';

    it('should be rendered', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('objectId property should be equal to screenService.orderId$', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.objectId).toBeNull();

      screenService.orderId = 'some order id' as any;
      fixture.detectChanges();

      expect(debugEl.componentInstance.objectId).toBe('some order id');
    });

    it('prefixForMnemonic property', () => {
      screenService.component = {
        ...screenServiceComponentMockData,
        id: 'some-id',
      };
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.prefixForMnemonic).toBe('some-id.FileUploadComponent');
    });

    it('attributes property should be equal to component.attrs', () => {
      screenService.component = {
        ...screenServiceComponentMockData,
        attrs: {
          uploads: [
            {
              uploadId: '1',
              label: '',
              fileType: 'txt',
              maxFileCount: '1',
              maxSize: '1000',
            },
          ],
        },
      } as ComponentDto;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.attributes).toEqual({
        uploads: [
          {
            uploadId: '1',
            label: '',
            fileType: 'txt',
            maxFileCount: '1',
            maxSize: '1000',
          },
        ],
      });
    });
  });

  describe('lib-button', () => {
    const selector = 'lib-button[epgu-constructor-action]';

    it('should be rendered', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    describe('disabled property', () => {
      it('should be TRUE by default', () => {
        const debugEl = fixture.debugElement.query(By.css(selector));

        expect(debugEl.componentInstance.disabled).toBeTruthy();
      });

      it('should be TRUE if NOT each uploader has a file OR NOT all files are uploaded', () => {
        const debugEl = fixture.debugElement.query(By.css(selector));

        // not each uploader has a file
        eventBusService.emit(BusEventType.FileUploadValueChangedEvent, {
          files: [
            {
              value: [],
            },
          ],
          relatedUploads: {
            uploads: [
              {
                uploadId: 'id1',
                files: [],
              },
            ],
          },
        });
        fixture.detectChanges();
        expect(debugEl.componentInstance.disabled).toBeTruthy();

        // not all files are uploaded
        eventBusService.emit(BusEventType.FileUploadValueChangedEvent, {
          files: [
            {
              value: [
                {
                  ...fileSample,
                  uploaded: false,
                },
              ],
            },
          ],
        });
        fixture.detectChanges();
        expect(debugEl.componentInstance.disabled).toBeTruthy();
      });

      it('should be FALSE if each uploader has a file AND all files are uploaded', () => {
        const debugEl = fixture.debugElement.query(By.css(selector));

        eventBusService.emit(BusEventType.FileUploadValueChangedEvent, {
          files: [
            {
              required: true,
              value: [
                {
                  ...fileSample,
                  uploaded: true,
                },
              ],
            },
          ],
          errors: [],
          relatedUploads: {
            uploads: [
              {
                uploadId: 'id1',
                required: true,
                files: [
                  {
                    ...fileSample,
                    uploaded: true,
                  },
                ],
              },
            ],
          },
        });
        fixture.detectChanges();
        expect(debugEl.componentInstance.disabled).toBeFalsy();
      });
    });

    it('action property', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.injector.get(ActionDirective).action).toEqual(button);
    });
  });

  describe('Total size info plate', () => {
    const selector = '.size-info';

    it('should be hidden if attrs.hideTotalAvailableSize and attrs.hideTotalAvailableCount is UNDEFINED', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeNull();
    });

    it('should be hidden if attrs.hideTotalAvailableSize and attrs.hideTotalAvailableCount is TRUE', () => {
      screenService.component = {
        ...screenServiceComponentMockData,
        ...{
          attrs: {
            hideTotalAvailableSize: true,
            hideTotalAvailableCount: true,
          } as FileUploadAttributes,
        },
      };
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeNull();
    });

    it('should be visible if attrs.hideTotalAvailableSize is FALSE and attrs.maxSize is defined', () => {
      screenService.component = {
        ...screenServiceComponentMockData,
        ...{
          attrs: {
            maxSize: 10000,
            hideTotalAvailableSize: false,
          } as FileUploadAttributes,
        },
      };
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();
    });

    it('should be visible if attrs.hideTotalAvailableCount is FALSE and attrs.maxFileCount is defined', () => {
      screenService.component = {
        ...screenServiceComponentMockData,
        ...{
          attrs: {
            maxFileCount: 10,
            hideTotalAvailableCount: false,
          } as FileUploadAttributes,
        },
      };
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();
    });
  });
});
