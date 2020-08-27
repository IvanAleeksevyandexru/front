import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthCertificateComponent } from './birth-certificate.component';
import { UnsubscribeService } from '../../../../../../services/unsubscribe/unsubscribe.service'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

// Need to refactoring component
describe.skip('BirthCertificateComponent', () => {
  let component: BirthCertificateComponent;
  let fixture: ComponentFixture<BirthCertificateComponent>;
  const mockData = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
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
