import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUploadScreenComponent } from './file-upload-screen.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EventBusService } from '../../../../form-player/services/event-bus/event-bus.service';
import { ComponentBase } from '../../../../screen/screen.types';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';

// TODO: Need to refactoring component
xdescribe('FileUploadScreenComponent', () => {
  let component: FileUploadScreenComponent;
  let fixture: ComponentFixture<FileUploadScreenComponent>;
  let mockData: ComponentBase = {
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
  } as ComponentBase;
  let screenService: ScreenService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [FileUploadScreenComponent],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        EventBusService,
      ],
    }).compileComponents();
    screenService = TestBed.inject(ScreenService);
  }));

  beforeEach(() => {
    screenService.component = mockData;
    screenService.header = '';
    screenService.submitLabel = '';
    fixture = TestBed.createComponent(FileUploadScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
