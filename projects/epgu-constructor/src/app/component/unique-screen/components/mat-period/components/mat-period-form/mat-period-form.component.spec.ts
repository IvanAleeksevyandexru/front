import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatPeriodFormComponent } from './mat-period-form.component';

describe('MatPeriodFormComponent', () => {
  let component: MatPeriodFormComponent;
  let fixture: ComponentFixture<MatPeriodFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatPeriodFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatPeriodFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
