import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhotoRequirementsModalComponent } from './photo-requirements-modal.component';
import { ConfigService } from '../../../../../shared/config/config.service';

xdescribe('PhotoRequirementsModalComponent', () => {
  let component: PhotoRequirementsModalComponent;
  let fixture: ComponentFixture<PhotoRequirementsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoRequirementsModalComponent ],
      providers: [ ConfigService ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoRequirementsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
