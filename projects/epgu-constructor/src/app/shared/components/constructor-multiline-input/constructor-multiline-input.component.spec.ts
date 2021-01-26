import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ValidationShowOn } from 'epgu-lib';
import { DateRangeService } from '../../../component/shared/components/components-list/services/date-range/date-range.service';
import { CoreModule } from '../../../core/core.module';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { BaseModule } from '../../base.module';
import { TextTransformModule } from '../../directives/text-transform/text-transform.module';
import { TrimModule } from '../../directives/trim/trim.module';
import { ValidationTypeModule } from '../../directives/validation-type/validation-type.module';
import { ValidationService } from '../../services/validation/validation.service';
import { TextTransform } from '../../types/textTransform';
import { ConstructorMultilineInputComponent } from './constructor-multiline-input.component';

describe('ConstructorMultilineInputComponent', () => {
  let component: ConstructorMultilineInputComponent;
  let fixture: ComponentFixture<ConstructorMultilineInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstructorMultilineInputComponent],
      imports: [
        CoreModule,
        BaseModule,
        RouterTestingModule,
        TrimModule,
        TextTransformModule,
        ValidationTypeModule,
      ],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        EventBusService,
        ValidationService,
        DateRangeService,
        DatesToolsService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorMultilineInputComponent);
    component = fixture.componentInstance;
    component.placeholder = '';
    component.control = new FormControl();
    component.id = '';
    component.invalid = true;
    component.validationShowOn = ValidationShowOn.TOUCHED;
    component.textTransformType = TextTransform.ALL;
    component.maxlength = 2;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
