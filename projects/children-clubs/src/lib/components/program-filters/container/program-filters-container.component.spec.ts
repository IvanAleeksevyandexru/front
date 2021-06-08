import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramFiltersContainerComponent } from './program-filters-container.component';

describe('ProgramFiltersContainerComponent', () => {
  let component: ProgramFiltersContainerComponent;
  let fixture: ComponentFixture<ProgramFiltersContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramFiltersContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramFiltersContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
