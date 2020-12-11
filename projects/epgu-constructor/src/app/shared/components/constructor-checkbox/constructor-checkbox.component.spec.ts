import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormControl } from '@angular/forms';

import { CoreModule } from '../../../core/core.module';
import { ConstructorCheckboxComponent } from './constructor-checkbox.component';

describe('ConstructorCheckboxComponent', () => {
  let component: ConstructorCheckboxComponent;
  let fixture: ComponentFixture<ConstructorCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstructorCheckboxComponent],
      imports: [CoreModule, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorCheckboxComponent);
    component = fixture.componentInstance;
    component.checkboxId = '123';
    component.control = new FormControl();
    component.labelText = '';
    component.required = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
