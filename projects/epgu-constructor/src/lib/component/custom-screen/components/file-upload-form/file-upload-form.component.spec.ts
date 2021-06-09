import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { FileUploadAttributes } from '../../../../core/services/terra-byte-api/terra-byte-api.types';

import { configureTestSuite } from 'ng-bullet';
import { Clarifications } from '@epgu/epgu-constructor-types';
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

describe('FileUploadComponent', () => {
  const fb = new FormBuilder();
  let component: FileUploadFormComponent;
  let fixture: ComponentFixture<FileUploadFormComponent>;
  let uploadService: UploaderLimitsService;
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
  let mockAttributes: FileUploadAttributes = {
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
  let mockComponent = {
    id: mockId,
    label: '',
    required: false,
    attrs: mockAttributes,
    type: 'FileUploadComponent',
  } as CustomComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
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
      ],
    })
      .overrideComponent(FileUploadFormComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadFormComponent);
    uploadService = TestBed.inject(UploaderLimitsService);
    eventService = TestBed.inject(EventBusService);
    formService = TestBed.inject(ComponentsListFormService);
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

  it('should be emit change for formService ', () => {
    jest.spyOn(formService, 'emitChanges');

    eventService.emit('fileUploadValueChangedEvent', payloadMock);
    expect(formService.emitChanges).toHaveBeenCalled();
  });

  it('should be update property files ', () => {
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
});
