import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileComponentComponent } from './upload-file.component';

describe('LablelSectionComponent', () => {
  let component: UploadFileComponentComponent;
  let fixture: ComponentFixture<UploadFileComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFileComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
