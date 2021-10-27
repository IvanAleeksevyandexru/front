import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';

import { EventBusService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { FileUploadAttributes } from '../../../../core/services/terra-byte-api/terra-byte-api.types';
import { Clarifications, DisplayDto, ScreenTypes } from '@epgu/epgu-constructor-types';
import { FileUploadFormComponent } from './file-upload-form.component';
import { ChangeDetectionStrategy, Injector } from '@angular/core';
import { FileUploadItemComponent } from '../../../../shared/components/file-upload/file-upload-item/file-upload-item.component';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload/file-upload.component';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { AbstractControl, FormArray, FormBuilder } from '@angular/forms';
import { CustomComponent } from '../../components-list.types';
import { UploaderLimitsService } from '../../../../shared/components/file-upload/services/limits/uploader-limits.service';
import { UploaderScreenService } from '../../../../shared/components/file-upload/services/screen/uploader-screen.service';
import { PluralizeModule } from '@epgu/ui/pipes';
import { FileSizeModule } from '../../../../shared/pipes/file-size/file-size.module';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';

describe('FileUploadComponent', () => {
  const fb = new FormBuilder();
  let component: FileUploadFormComponent;
  let fixture: ComponentFixture<FileUploadFormComponent>;
  let screenService: ScreenService;
  let eventService: EventBusService;
  let formService: ComponentsListFormService;
  let form: FormArray;
  let mockId = 'test';
  let control: AbstractControl;
  let controlValue: AbstractControl;

  const payloadMock = {
    uploadId: '1',
    value: [],
    errors: [],
    files: [],
  };
  const mockAttributes: FileUploadAttributes = {
    clarifications: ([] as unknown) as Clarifications,
    maxFileCount: 1,
    maxSize: 1,
    uploads: [
      {
        uploadId: '1',
        label: '',
        fileType: ['txt'],
        maxFileCount: 1,
        maxSize: 42,
      },
    ],
  };
  const mockComponent = {
    id: mockId,
    label: '',
    required: false,
    attrs: mockAttributes,
    type: 'FileUploadComponent',
  } as CustomComponent;

  const mockDisplay: DisplayDto = {
    id: 'loadFiles',
    name: '',
    type: ScreenTypes.CUSTOM,
    header: 'someHeader',
    components: [mockComponent],
    terminal: false,
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PluralizeModule, FileSizeModule],
      declarations: [
        FileUploadFormComponent,
        MockComponent(FileUploadComponent),
        MockComponent(FileUploadItemComponent),
      ],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        UploaderLimitsService,
        EventBusService,
        Injector,
        UploaderScreenService,
        UnsubscribeService,
      ],
    })
      .overrideComponent(FileUploadFormComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    eventService = TestBed.inject(EventBusService);
    formService = TestBed.inject(ComponentsListFormService);
    screenService = TestBed.inject(ScreenService);

    fixture = TestBed.createComponent(FileUploadFormComponent);
    screenService.component = mockComponent;
    screenService.display = mockDisplay;
    component = fixture.componentInstance;
    component.componentIndex = 0;
    const { type, attrs, id, label, required } = mockComponent;

    form = new FormArray([
      fb.group({
        type,
        attrs,
        id,
        label,
        required,
        value: [
          {
            value: mockComponent,
            disabled: mockComponent.attrs.disabled,
          },
        ],
      }),
    ]);
    control = form.controls[0];
    controlValue = form.controls[0].get('value');
    jest.spyOn(formService, 'form', 'get').mockReturnValue(form);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extend AbstractComponentListItemComponent', () => {
    expect(component).toBeInstanceOf(AbstractComponentListItemComponent);
  });

  it('should emit change for formService ', () => {
    jest.spyOn(formService, 'emitChanges');

    eventService.emit('fileUploadValueChangedEvent', payloadMock);
    expect(formService.emitChanges).toHaveBeenCalled();
  });

  it('should update property files ', () => {
    const payload = { ...payloadMock, files: [{ uploadId: '1' }] };
    eventService.emit('fileUploadValueChangedEvent', payload);

    expect(component.files).toEqual(payload.files);
  });

  it('should be control setValue ', () => {
    jest.spyOn(controlValue, 'setValue');
    const payload = { ...payloadMock, files: [{ uploadId: '1' }] };
    eventService.emit('fileUploadValueChangedEvent', payload);
    const check = {
      uploads: payload.files,
      totalSize: 0,
      totalCount: 0,
    };
    expect(controlValue.setValue).toHaveBeenCalledWith(check);
  });

  it('should be control setErrors for maxAmount ', () => {
    jest.spyOn(controlValue, 'setErrors');
    const payload = {
      ...payloadMock,
      files: [{ uploadId: '1', value: [{ uploaded: true }, { uploaded: true }] }],
    };

    eventService.emit('fileUploadValueChangedEvent', payload);
    expect(controlValue.setErrors).toHaveBeenCalledWith({ required: true });
  });

  it('should be control setErrors for maxSize ', () => {
    jest.spyOn(controlValue, 'setErrors');
    const payload = {
      ...payloadMock,
      files: [{ uploadId: '1', value: [{ uploaded: true, fileSize: 2 }] }],
    };

    eventService.emit('fileUploadValueChangedEvent', payload);
    expect(controlValue.setErrors).toHaveBeenCalledWith({ required: true });
  });

  it('should be control setErrors for maxSize ', () => {
    jest.spyOn(controlValue, 'setErrors');
    const payload = {
      ...payloadMock,
      files: [{ uploadId: '1', value: [{ uploaded: true, fileSize: 2 }] }],
    };

    eventService.emit('fileUploadValueChangedEvent', payload);
    expect(controlValue.setErrors).toHaveBeenCalledWith({ required: true });
  });

  it('should be prefixForMnemonic', (done) => {
    component.prefixForMnemonic$.subscribe((mnemonic) => {
      expect(mnemonic).toBe(`${mockId}.FileUploadComponent`);
      done();
    });
    control.updateValueAndValidity();
  });

  describe('Total size info plate', () => {
    const selector = '.size-info';

    it('should be hidden if attrs.hideTotalAvailableSize and attrs.hideTotalAvailableCount is UNDEFINED', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeNull();
    });

    it('should be hidden if attrs.hideTotalAvailableSize and attrs.hideTotalAvailableCount is TRUE', () => {
      screenService.component = {
        ...mockComponent,
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
        ...mockComponent,
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
        ...mockComponent,
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
