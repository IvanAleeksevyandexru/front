import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadScreenComponent } from './file-upload-screen.component';

describe('FileUploadScreenComponent', () => {
  let component: FileUploadScreenComponent;
  let fixture: ComponentFixture<FileUploadScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileUploadScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
