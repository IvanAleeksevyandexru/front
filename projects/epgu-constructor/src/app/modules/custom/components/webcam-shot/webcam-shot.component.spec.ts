import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebcamShotComponent } from './webcam-shot.component';

describe('FileUploadComponent', () => {
  let component: WebcamShotComponent;
  let fixture: ComponentFixture<WebcamShotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebcamShotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebcamShotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
