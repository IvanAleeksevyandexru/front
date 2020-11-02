import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUploadScreenComponent } from './file-upload-screen.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentBase } from '../../../../screen/screen.types';

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
          maxSize: '42'
        }
      ]
    },
    id: '',
    label: '',
    type: '',
    value: '',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ FileUploadScreenComponent ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    component.header = '';
    component.submitLabel = '';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});