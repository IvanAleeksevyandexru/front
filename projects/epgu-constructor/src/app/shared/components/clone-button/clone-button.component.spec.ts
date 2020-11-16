import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneButtonComponent } from './clone-button.component';

describe('CloneButtonComponent', () => {
  let component: CloneButtonComponent;
  let fixture: ComponentFixture<CloneButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
