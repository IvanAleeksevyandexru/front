import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarErrorComponent } from './car-error.component';

describe('CarErrorComponent', () => {
  let component: CarErrorComponent;
  let fixture: ComponentFixture<CarErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
