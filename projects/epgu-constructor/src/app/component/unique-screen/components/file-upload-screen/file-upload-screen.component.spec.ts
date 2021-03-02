import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { FileUploadScreenComponent } from './file-upload-screen.component';
import { MockComponent, MockDirective, MockModule } from 'ng-mocks';
import { EpguLibModule } from 'epgu-lib';
import { PageNameComponent } from '../../../../shared/components/base-components/page-name/page-name.component';
import { ScreenContainerComponent } from '../../../../shared/components/screen-container/screen-container.component';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { FileUploadComponent } from './sub-components/file-upload/file-upload.component';
import { ActionDirective } from '../../../../shared/directives/action/action.directive';
import { FileResponseToBackendUploadsItem, UploadedFile } from '../../services/terra-byte-api/terra-byte-api.types';
import { By } from '@angular/platform-browser';
import {
  ActionType,
  ComponentDto,
  DTOActionAction
} from '../../../../form-player/services/form-player-api/form-player-api.types';

const screenServiceComponentMockData: ComponentDto = {
  attrs: {
    uploads: [
      {
        uploadId: '1',
        label: '',
        fileType: 'txt',
        maxFileCount: '1',
        maxSize: '42',
      },
    ],
  },
  id: '',
  label: '',
  type: '',
  value: '',
} as ComponentDto;

const fileSample: UploadedFile = {
  fileName: 'file-name',
  objectId: 'object-id',
  objectTypeId: 1,
  mnemonic: 'mnemonic-sample',
  uploaded: true,
  fileSize: 100,
  hasError: false,
};

describe('FileUploadScreenComponent', () => {
  let component: FileUploadScreenComponent;
  let fixture: ComponentFixture<FileUploadScreenComponent>;

  let screenService: ScreenServiceStub;
  let currentAnswersService: CurrentAnswersService;
  let eventBusService: EventBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // MockModule(FileUploadModule),
        MockModule(EpguLibModule)
      ],
      declarations: [
        FileUploadScreenComponent,
        MockComponent(ScreenContainerComponent),
        MockComponent(FileUploadComponent),
        MockComponent(PageNameComponent),
        MockDirective(ActionDirective)
      ],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        EventBusService,
        CurrentAnswersService
      ]
    }).overrideComponent(FileUploadScreenComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    });
  });

  beforeEach(() => {
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    screenService.component = screenServiceComponentMockData;
    screenService.header = '';
    screenService.submitLabel = '';

    currentAnswersService = TestBed.inject(CurrentAnswersService);
    eventBusService = TestBed.inject(EventBusService);

    fixture = TestBed.createComponent(FileUploadScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
            value: [fileSample]
          }
        ]
      };

      eventBusService.emit('fileUploadValueChangedEvent', eventData);
      expect(currentAnswersService.state).toEqual({
        id: '',
        type: 'FileUploadComponent',
        uploads: [
          {
            value: [fileSample]
          }
        ]
      });
    });

    // eslint-disable-next-line max-len
    it('should be updated on EventBus fileUploadValueChangedEvent if eventData.relatedUploads AND currentAnswersService.state.uploads', () => {
      currentAnswersService.state = {
        id: '',
        type: 'FileUploadComponent',
        uploads: [
          {
            value: [fileSample]
          }
        ]
      };

      const eventData: FileResponseToBackendUploadsItem = {
        files: [
          {
            value: [fileSample]
          }
        ],
        relatedUploads: {
          uploads: [{
            uploadId: 'id1',
            files: [],
          }]
        }
      };

      eventBusService.emit('fileUploadValueChangedEvent', eventData);
      expect(currentAnswersService.state).toEqual({
        id: '',
        type: 'FileUploadComponent',
        uploads: [
          {
            value: [fileSample]
          }
        ]
      });
    });
  });

  describe('epgu-constructor-screen-container', () => {
    const selector = 'epgu-constructor-screen-container';

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
        label: ''
      };
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();

      screenService.header = '';
      screenService.component = {
        ...screenServiceComponentMockData,
        label: 'some label'
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

      screenService.orderId = 'some order id';
      fixture.detectChanges();

      expect(debugEl.componentInstance.objectId).toBe('some order id');
    });

    it('applicantAnswers property should be equal to screenService.applicantAnswers$', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.applicantAnswers).toBeNull();

      screenService.applicantAnswers = {
        someKey: {
          visited: true,
          value: 'some value',
        }
      };
      fixture.detectChanges();

      expect(debugEl.componentInstance.applicantAnswers).toEqual({
        someKey: {
          visited: true,
          value: 'some value',
        }
      });
    });

    it('prefixForMnemonic property', () => {
      screenService.component = {
        ...screenServiceComponentMockData,
        id: 'some-id'
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
              maxSize: '42',
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
            maxSize: '42',
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

    it('showLoader property should be equal to screenService.isLoading$', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.showLoader).toBeFalsy();

      screenService.isLoadingSubject$.next(true);
      fixture.detectChanges();

      expect(debugEl.componentInstance.showLoader).toBeTruthy();
    });

    describe('disabled property', () => {
      it('should be TRUE by default', () => {
        const debugEl = fixture.debugElement.query(By.css(selector));

        expect(debugEl.componentInstance.disabled).toBeTruthy();
      });

      it('should be TRUE if NOT each uploader has a file OR NOT all files are uploaded', () => {
        const debugEl = fixture.debugElement.query(By.css(selector));

        // not each uploader has a file
        eventBusService.emit('fileUploadValueChangedEvent', {
          files: [
            {
              value: []
            }
          ],
          relatedUploads: {
            uploads: [{
              uploadId: 'id1',
              files: [],
            }]
          }
        });
        fixture.detectChanges();
        expect(debugEl.componentInstance.disabled).toBeTruthy();

        // not all files are uploaded
        eventBusService.emit('fileUploadValueChangedEvent', {
          files: [
            {
              value: [{
                ...fileSample,
                uploaded: false
              }]
            }
          ],
        });
        fixture.detectChanges();
        expect(debugEl.componentInstance.disabled).toBeTruthy();
      });

      it('should be FALSE if each uploader has a file AND all files are uploaded', () => {
        const debugEl = fixture.debugElement.query(By.css(selector));

        eventBusService.emit('fileUploadValueChangedEvent', {
          files: [
            {
              value: [{
                ...fileSample,
                uploaded: true
              }]
            }
          ],
          relatedUploads: {
            uploads: [{
              uploadId: 'id1',
              files: [{
                ...fileSample,
                uploaded: true
              }],
            }]
          }
        });
        fixture.detectChanges();
        expect(debugEl.componentInstance.disabled).toBeFalsy();
      });
    });

    it('action property', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.injector.get(ActionDirective).action).toEqual({
        label: 'Далее',
        action: DTOActionAction.getNextStep,
        value: '',
        type: ActionType.nextStep,
      });
    });
  });
});


