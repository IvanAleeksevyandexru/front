import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalComplianceComponent } from './legal-compliance.component';

describe('LegalComplianceComponent', () => {
  let component: LegalComplianceComponent;
  let fixture: ComponentFixture<LegalComplianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegalComplianceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
