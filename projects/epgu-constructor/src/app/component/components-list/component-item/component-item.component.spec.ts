import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentItemComponent } from './component-item.component';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { formattedError } from '@angular/compiler';

describe('ComponentItemComponent', () => {
  let component: ComponentItemComponent;
  let fixture: ComponentFixture<ComponentItemComponent>;
  let fb: FormBuilder;
  let formData: AbstractControl;
  let mockData = {
    data: {
      value: {
        label: '',
        attrs: {
          hint: '',
        },
        required: '',
        type: '',
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentItemComponent ],
      imports: [SharedModule]
    })
    .compileComponents();
    fb = TestBed.inject(FormBuilder);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentItemComponent);
    component = fixture.componentInstance;
    formData = fb.group(mockData);
    component.data = formData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
