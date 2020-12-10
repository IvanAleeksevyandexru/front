import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ValidationShowOn } from 'epgu-lib/lib/models/validation-show';

import { ConstructorDropdownComponent } from './constructor-dropdown.component';
import { CoreModule } from '../../../core/core.module';
import { FormControl } from '@angular/forms';

describe('ConstructorDropdownComponent', () => {
  let component: ConstructorDropdownComponent;
  let fixture: ComponentFixture<ConstructorDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstructorDropdownComponent],
      imports: [CoreModule, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorDropdownComponent);
    component = fixture.componentInstance;
    component.id = '123';
    component.control = new FormControl();
    component.invalid = false;
    component.validationShowOn = ValidationShowOn.IMMEDIATE;
    component.clearable = false;
    component.disabled = false;
    component.localSearch = false;
    component.placeholder = '&mdash;';
    component.items = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
