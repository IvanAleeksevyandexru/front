import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthCertificateComponent } from './birth-certificate.component';
import { UnsubscribeService } from '../../../../../../services/unsubscribe/unsubscribe.service'

describe('BirthCertificateComponent', () => {
  let component: BirthCertificateComponent;
  let fixture: ComponentFixture<BirthCertificateComponent>;
  const mockData = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BirthCertificateComponent ],
      providers: [UnsubscribeService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BirthCertificateComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
