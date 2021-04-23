import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarDetailInfoContainerComponent } from './car-detail-info-container.component';

describe('CarDetailsInfoComponent', () => {
  let component: CarDetailInfoContainerComponent;
  let fixture: ComponentFixture<CarDetailInfoContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarDetailInfoContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarDetailInfoContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
