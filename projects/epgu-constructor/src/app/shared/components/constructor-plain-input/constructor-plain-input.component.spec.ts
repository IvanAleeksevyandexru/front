import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';

import { ConstructorPlainInputComponent } from './constructor-plain-input.component';
import { SharedModule } from '../../shared.module';
import { CoreModule } from '../../../core/core.module';
import { TextTransform } from '../../types/textTransform';

describe('ConstructorPlainInputComponent', () => {
  let component: ConstructorPlainInputComponent;
  let fixture: ComponentFixture<ConstructorPlainInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstructorPlainInputComponent],
      imports: [CoreModule, SharedModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorPlainInputComponent);
    component = fixture.componentInstance;
    component.placeholder = '';
    component.price = true;
    component.control = new FormControl();
    component.id = '';
    component.invalid = true;
    component.validationShowOn = ValidationShowOn.TOUCHED;
    component.textTransformType = TextTransform.ALL;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
