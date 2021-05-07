import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import {
  FileUploadAttributes,
  UploadedFile,
} from '../../../../core/services/terra-byte-api/terra-byte-api.types';

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
import { FormArray, FormControl } from '@angular/forms';

describe('FileUploadComponent', () => {
  let component: FileUploadFormComponent;
  let fixture: ComponentFixture<FileUploadFormComponent>;
  let uploadService: FileUploadService;
  let eventService: EventBusService;
  let formService: ComponentsListFormService;
  let form: FormArray;
  let mockId = 'test';
  let mockAttributes: FileUploadAttributes = {
    clarifications: ([] as unknown) as Clarifications,
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
  let mockComponent = { id: mockId, attrs: mockAttributes };

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
    form = new FormArray([new FormControl(mockComponent)]);
    jest.spyOn(formService, 'form', 'get').mockReturnValue(form);
    fixture.detectChanges();
  });

  it('should be prefixForMnemonic', (done) => {
    component.prefixForMnemonic$.subscribe((mnemonic) => {
      expect(mnemonic).toBe(`${mockId}.FileUploadComponent`);
      done();
    });
    form.controls[0].setValue(mockComponent);
  });
});
