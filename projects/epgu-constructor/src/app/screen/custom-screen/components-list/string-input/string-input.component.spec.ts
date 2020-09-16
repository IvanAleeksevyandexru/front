import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AppTranslatePipe,
  LibTranslatePipe,
  PipedMessagePipe,
  PlainInputComponent,
  QuestionHelpTipComponent,
  ValidationShowOn,
} from 'epgu-lib';

import { StringInputComponent } from './string-input.component';
import { CustomComponent, CustomScreenComponentTypes } from '../../custom-screen.types';
import { LabelComponent } from '../../../../shared/components/base/label/label.component';
import { HelperTextComponent } from '../../../../shared/components/base/helper-text/helper-text.component';

describe('StringInputComponent', () => {
  let component: StringInputComponent;
  let fixture: ComponentFixture<StringInputComponent>;
  const data: CustomComponent = {
    id: 'linn',
    label: 'ИНН юридического лица',
    required: true,
    type: CustomScreenComponentTypes.StringInput,
    value: '',
    attrs: {
      fields: [],
      ref: [],
      labelAttr: '',
      dictionaryType: '',
      required: true,
      validation: [
        {
          condition: '',
          errorMsg: 'Поле должно быть заполено, не более 14 символов',
          ref: '',
          type: 'RegExp',
          value: '^S{1,14}$',
          dataType: '',
        },
      ],
    },
  };
  const invalid = true;
  const helperText = '';
  const validationShowOn: ValidationShowOn = ValidationShowOn.TOUCHED;
  const value = '';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StringInputComponent,
        PlainInputComponent,
        LabelComponent,
        HelperTextComponent,
        QuestionHelpTipComponent,
        LibTranslatePipe,
        PipedMessagePipe,
        AppTranslatePipe,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StringInputComponent);
    component = fixture.componentInstance;
    component.data = data;
    component.invalid = invalid;
    component.helperText = helperText;
    component.validationShowOn = validationShowOn;
    component.value = value;
    spyOn(component.handleChangeEvent, 'emit');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
