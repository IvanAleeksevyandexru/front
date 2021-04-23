import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarTechnicalDataComponent } from './car-technical-data.component';

describe('CarTechicalDataComponent', () => {
  let component: CarTechnicalDataComponent;
  let fixture: ComponentFixture<CarTechnicalDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarTechnicalDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarTechnicalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
