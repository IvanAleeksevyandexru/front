import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentItemComponent } from './component-item.component';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from 'epgu-lib';
import { WebcamShootModule } from '../webcam-shoot/webcam-shoot.module';
import { HelperTextComponent } from '../base-components/helper-text/helper-text.component';
import { LabelComponent } from '../base-components/label/label.component';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { BaseModule } from '../../base.module';
import { CoreModule } from '../../../core/core.module';
import { ClickableLabelModule } from '../../directives/clickable-label/clickable-label.module';
import { ConfigService } from '../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../core/services/config/config.service.stub';
import { ModalService } from '../../../modal/modal.service';
import { ModalServiceStub } from '../../../modal/modal.service.stub';
import { ActionService } from '../../directives/action/action.service';
import { ActionServiceStub } from '../../directives/action/action.service.stub';
import { CurrentAnswersService } from '../../../screen/current-answers.service';

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
      imports: [
        CoreModule,
        BaseModule,
        RouterTestingModule,
        WebcamShootModule,
        ClickableLabelModule,
      ],
      providers: [
        HealthService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        CurrentAnswersService
      ],
    }).compileComponents();
    fb = TestBed.inject(FormBuilder);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentItemComponent);
    component = fixture.componentInstance;
    formData = fb.group(mockData);
    component.control = formData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
