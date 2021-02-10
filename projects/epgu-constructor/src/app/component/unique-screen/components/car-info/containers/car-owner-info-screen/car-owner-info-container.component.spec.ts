import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarOwnerInfoContainerComponent } from './car-owner-info-container.component';

describe('CarOwnerInfoContainerComponent', () => {
  let component: CarOwnerInfoContainerComponent;
  let fixture: ComponentFixture<CarOwnerInfoContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarOwnerInfoContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarOwnerInfoContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
