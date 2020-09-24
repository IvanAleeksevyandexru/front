import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ComponentStateService } from '../../../../services/component-state/component-state.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { ToolsService } from '../../../../shared/services/tools/tools.service';
import { TextTransform } from '../../../../shared/types/textTransform';

@Component({
  selector: 'epgu-constructor-add-passport',
  templateUrl: './add-passport.component.html',
  styleUrls: ['./add-passport.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPassportComponent implements OnInit {
  @Input() data: any;
  @Input() header: string;
  @Input() currentCycledFields: object = {};
  @Input() submitLabel: string;

  passportForm: FormGroup;
  isCycledFields: boolean;
  cycledValues: any;

  constructor(
    private fb: FormBuilder,
    private componentStateService: ComponentStateService,
    private ngUnsubscribe$: UnsubscribeService,
    private toolsService: ToolsService,
  ) {}

  ngOnInit(): void {
    const controls = {};

    this.data.attrs.fields.forEach((field) => {
      // Добавим валидацию полей
      const validators = [Validators.required];
      if (field.maxlength) {
        validators.push(Validators.maxLength(field.maxlength));
      }
      if (field.minlength) {
        validators.push(Validators.minLength(field.minlength));
      }
      controls[field.fieldName] = this.fb.control(null, [Validators.required]);
    });

    this.passportForm = this.fb.group(controls);

    this.isCycledFields = Boolean(Object.keys(this.currentCycledFields).length);
    if (this.isCycledFields) {
      [this.cycledValues] = [
        ...Object.values(this.currentCycledFields).map((value) => JSON.parse(value)),
      ];
      // format state data to {fieldName: value} format
      const data = this.data.attrs.fields.reduce((result, item) => {
        const { fieldName } = item;
        if (!fieldName) return result;

        // eslint-disable-next-line no-param-reassign
        result[fieldName] = this.cycledValues[fieldName];
        return result;
      }, {});
      this.data.value = JSON.stringify(data);
    }

    this.passportForm.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$), debounceTime(300))
      .subscribe((changes) => {
        if (!this.passportForm.valid) {
          return;
        }

        let stateData: any;
        if (this.isCycledFields) {
          stateData = this.toolsService.getFormattedCycledValues(
            changes,
            this.currentCycledFields,
            this.cycledValues,
          );
        } else {
          stateData = changes;
        }

        this.componentStateService.state = stateData;
      });
  }

  get textTransformType(): TextTransform {
    return this.data?.attrs?.fstuc;
  }
}
