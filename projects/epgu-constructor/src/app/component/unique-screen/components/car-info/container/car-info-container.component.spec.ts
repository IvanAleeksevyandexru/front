import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarInfoContainerComponent } from './car-info-container.component';

describe('CarInfoContainerComponent', () => {
  let component: CarInfoContainerComponent;
  let fixture: ComponentFixture<CarInfoContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarInfoContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarInfoContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
