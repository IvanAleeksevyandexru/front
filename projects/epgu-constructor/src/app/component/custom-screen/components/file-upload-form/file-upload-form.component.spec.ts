import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { FileUploadAttributes } from '../../../../core/services/terra-byte-api/terra-byte-api.types';

import { configureTestSuite } from 'ng-bullet';
import { Clarifications } from 'epgu-constructor-types';
import { FileUploadFormComponent } from './file-upload-form.component';
import { ChangeDetectionStrategy, Injector } from '@angular/core';
import { FileUploadItemComponent } from '../../../../shared/components/file-upload/file-upload-item/file-upload-item.component';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload/file-upload.component';
import { FileUploadService } from '../../../../shared/components/file-upload/file-upload.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CustomComponent } from '../../components-list.types';

describe('FileUploadComponent', () => {
  const fb = new FormBuilder();
  let component: FileUploadFormComponent;
  let fixture: ComponentFixture<FileUploadFormComponent>;
  let uploadService: FileUploadService;
  let eventService: EventBusService;
  let formService: ComponentsListFormService;
  let form: FormArray;
  let mockId = 'test';
  let control: AbstractControl;
  let controlValue: AbstractControl;
  let mockAttributes: FileUploadAttributes = {
    clarifications: ([] as unknown) as Clarifications,
    maxFileCount: 1,
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
        FileUploadService,
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
    uploadService = TestBed.inject(FileUploadService);
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

  it('should be change file upload value by event ', () => {
    jest.spyOn(controlValue, 'setValue');
    jest.spyOn(controlValue, 'setErrors');
    jest.spyOn(formService, 'emitChanges');
    const payload = {
      uploadId: '1',
      value: [],
      errors: [],
      files: [{ uploadId: '1', value: [{ uploaded: true }, { uploaded: true }] }],
    };
    eventService.emit('fileUploadValueChangedEvent', payload);
    const check = {
      uploads: payload.files,
    };
    expect(controlValue.setValue).toHaveBeenCalledWith(check);
    expect(controlValue.setErrors).toHaveBeenCalledWith({ required: true });
    expect(component.files).toEqual(payload.files);
    expect(formService.emitChanges).toHaveBeenCalled();
  });

  it('should be prefixForMnemonic', (done) => {
    component.prefixForMnemonic$.subscribe((mnemonic) => {
      expect(mnemonic).toBe(`${mockId}.FileUploadComponent`);
      done();
    });
    control.updateValueAndValidity();
  });
});
