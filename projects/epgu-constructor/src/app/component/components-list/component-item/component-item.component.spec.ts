import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentItemComponent } from './component-item.component';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from 'epgu-lib';
import { WebcamShootModule } from '../../../shared/components/webcam-shoot/webcam-shoot.module';
import { HelperTextComponent } from '../../../shared/components/base/helper-text/helper-text.component';
import { LabelComponent } from '../../../shared/components/base/label/label.component';

import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { CoreModule } from '../../../core/core.module';

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
      declarations: [ComponentItemComponent, LabelComponent, HelperTextComponent],
      imports: [CoreModule, RouterTestingModule, WebcamShootModule],
      providers: [HealthService, { provide: ScreenService, useClass: ScreenServiceStub }],
    }).compileComponents();
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
