import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadComponent } from './file-upload.component';
import { IFileUploadAttributes } from '../../../../../../../interfaces/terabyte.interface';
import { MockComponent } from 'ng-mocks';
import { FileUploadItemComponent } from '../file-upload-item/file-upload-item.component';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let FileUploadItemComponentMock = MockComponent(FileUploadItemComponent);
  let mockAttributes: IFileUploadAttributes = {
    clarifications: [],
    uploads: [
      {
        uploadId: '1',
        label: '',
        fileType: ['txt'],
        maxFileCount: 1,
        maxSize: 42
      }
    ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileUploadComponent, FileUploadItemComponentMock ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    component.attributes = mockAttributes;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
