import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarOwnerInfoComponent } from './car-owner-info.component';

describe('CarOwnerInfoComponent', () => {
  let component: CarOwnerInfoComponent;
  let fixture: ComponentFixture<CarOwnerInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarOwnerInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarOwnerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
