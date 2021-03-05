import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatPeriodContainerComponent } from './mat-period-container.component';

describe('MatPeriodContainerComponent', () => {
  let component: MatPeriodContainerComponent;
  let fixture: ComponentFixture<MatPeriodContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatPeriodContainerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatPeriodContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
