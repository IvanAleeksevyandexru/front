import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentItemComponent } from './component-item.component';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from 'epgu-lib';

import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';

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
      imports: [SharedModule, RouterTestingModule],
      providers: [
        HealthService, 
        { provide: ScreenService, useClass: ScreenServiceStub },      
      ]
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
