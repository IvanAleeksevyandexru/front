import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthCertificateComponent } from './birth-certificate.component';

describe('BirthCertificateComponent', () => {
  let component: BirthCertificateComponent;
  let fixture: ComponentFixture<BirthCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BirthCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BirthCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
