import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentItemComponent } from './component-item.component';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from 'epgu-lib';
import { WebcamShootModule } from '../../../../../shared/components/webcam-shoot/webcam-shoot.module';
import { HelperTextComponent } from '../../../../../shared/components/base-components/helper-text/helper-text.component';
import { LabelComponent } from '../../../../../shared/components/base-components/label/label.component';

import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { BaseModule } from '../../../../../shared/base.module';
import { CoreModule } from '../../../../../core/core.module';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';

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
      imports: [CoreModule, BaseModule, RouterTestingModule, WebcamShootModule],
      providers: [
        HealthService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        UnsubscribeService,
      ],
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
