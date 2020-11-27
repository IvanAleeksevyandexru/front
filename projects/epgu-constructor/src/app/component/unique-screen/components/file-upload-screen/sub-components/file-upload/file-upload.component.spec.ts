import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadComponent } from './file-upload.component';
import { FileUploadAttributes } from '../../../../../../shared/services/terra-byte-api/terra-byte-api.types';
import { MockComponent } from 'ng-mocks';
import { FileUploadItemComponent } from '../file-upload-item/file-upload-item.component';
import { FileUploadService } from '../file-upload.service';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let FileUploadItemComponentMock = MockComponent(FileUploadItemComponent);
  let mockAttributes: FileUploadAttributes = {
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
      providers: [FileUploadService],
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
