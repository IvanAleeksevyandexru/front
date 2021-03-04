import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatPeriodDescriptionComponent } from './mat-period-description.component';

describe('MatPeriodDescriptionComponent', () => {
  let component: MatPeriodDescriptionComponent;
  let fixture: ComponentFixture<MatPeriodDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatPeriodDescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatPeriodDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
