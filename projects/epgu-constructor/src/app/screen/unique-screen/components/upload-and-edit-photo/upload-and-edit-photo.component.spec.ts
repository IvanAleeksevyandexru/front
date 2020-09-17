import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAndEditPhotoComponent } from './upload-and-edit-photo.component';

describe('UploadAndEditPhotoComponent', () => {
  let component: UploadAndEditPhotoComponent;
  let fixture: ComponentFixture<UploadAndEditPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadAndEditPhotoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadAndEditPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
