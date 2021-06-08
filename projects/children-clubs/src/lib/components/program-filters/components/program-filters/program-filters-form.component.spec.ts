import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramFiltersFormComponent } from './program-filters-form.component';

describe('ProgramFiltersComponent', () => {
  let component: ProgramFiltersFormComponent;
  let fixture: ComponentFixture<ProgramFiltersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramFiltersFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramFiltersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
