import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelSectionComponent } from './label-section.component';

describe('LablelSectionComponent', () => {
  let component: LabelSectionComponent;
  let fixture: ComponentFixture<LabelSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
