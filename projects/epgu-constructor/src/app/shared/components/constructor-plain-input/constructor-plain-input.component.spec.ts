import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructorPlainInputComponent } from './constructor-plain-input.component';

describe('ConstructorPlainInputComponent', () => {
  let component: ConstructorPlainInputComponent;
  let fixture: ComponentFixture<ConstructorPlainInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstructorPlainInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorPlainInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
