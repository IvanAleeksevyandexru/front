import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructorMaskedInputComponent } from './constructor-masked-input.component';

describe('ConstructorMaskedInputComponent', () => {
  let component: ConstructorMaskedInputComponent;
  let fixture: ComponentFixture<ConstructorMaskedInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstructorMaskedInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorMaskedInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
