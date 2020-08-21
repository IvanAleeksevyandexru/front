import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingScreenComponent } from './booking-screen.component';

describe('BookingScreenComponent', () => {
  let component: BookingScreenComponent;
  let fixture: ComponentFixture<BookingScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
