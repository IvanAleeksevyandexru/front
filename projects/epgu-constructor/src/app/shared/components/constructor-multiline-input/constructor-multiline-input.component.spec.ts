import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ValidationShowOn } from 'epgu-lib';
import { DateRangeService } from '../../services/date-range/date-range.service';
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
import { ConstructorMultilineInputComponent } from './constructor-multiline-input.component';
import { By } from '@angular/platform-browser';
import { TextTransform } from 'epgu-constructor-types/dist/base/text-transform';

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
    component.commitOnInput = true;
    component.maxlength = 4;
    fixture.detectChanges();
  });

  it('check input', () => {
    const editInput: HTMLDivElement = fixture.debugElement.query(By.css('.multiline-input'))
      .nativeElement;

    const text = 'text';
    editInput.innerHTML = text;
    editInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.control.value).toBe(text);
  });
});
